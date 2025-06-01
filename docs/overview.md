---
slug: /
sidebar_label: Overview
sidebar_position: 1
title: Documentation
---

# Imprint

Imprint is a binary row serialization format built for stream processing
workloads, particularly those involving **incremental joins** and
**denormalization** across heterogeneous data sources. It combines the
flexibility of schemaless formats like JSON with the safety and performance of
schema-aware formats like Avro or Protobuf.

## Core Principles

Imprint as a serialization format is opinionated about its core principles. Specifically,
the goal is to allow efficient row-level data manipulation and easy debugging:

| Feature                   | Description                                                                   |
|---------------------------|-------------------------------------------------------------------------------|
| **Message Composition**   | Combining records with different schemas can be done without reserialization  |
| **Message Decomposition** | Projecting a subset of fields can be done without full deserialization        |
| **Field Addressable**     | Each field can be deserialized without deserializing the entire record        |
| **Schemaless Reads**      | Messages can be read without access to the schema that wrote the record       |

Existing formats are typically either optimized for RPCs (JSON/Protobuf) or
efficient in-memory representation (Flatbuffer). AVRO's reader/writer schema
support is perhaps the best example of a row-oriented format designed for data
manipulation and evolution but it is extremely inefficient in its use for the
most common streaming operations.

## Comparison with Existing Formats

See the table below more detailed comparison of existing formats:

| Feature                       | Imprint | JSON | Avro | Protobuf | Flatbuffer |
| ----------------------------- | ------- | ---- | ---- | -------- | ---------- |
| Message Composition           | ✅      | ⚠️    |❌    | ❌        | ❌         |
| Message Decomposition         | ✅      | ❌    |❌    | ❌        | ✅         |
| Field Addressable             | ✅      | ❌    |❌    | ❌        | ✅         |
| Compact Binary Format         | ⚠️      | ❌    |✅    | ✅        | ✅         |
| Native Schema Evolution       | ✅      | ⚠️    |✅    | ✅        | ❌         |
| Schema-less Reads             | ⚠️      | ✅    |❌    | ❌        | ❌         |

Digging deeper into AVRO and Protobuf, which are the existing dominators in the
stream processing space, this table explains a bit more behind why the limitations
of each system is as it is:

| Capability | Avro | Protobuf | Imprint |
|------------|------|-----------|----------|
| Random field access | Sequential scan (O(record size)) | Tag stream scan (O(record size)) | Offset directory → O(log N) lookup |
| Compose / merge rows without re‑encoding | ❌ (must re‑serialize with merged schema) | ❌ (decode + re‑encode) | ✅ pointer‑math on directories & value areas |
| Self‑contained row (no external schema) | ⚠️ Container files embed writer schema; single rows often rely on registry | ⚠️ Code‑generated classes needed | ✅ type‑code + length in directory ⇒ schema‑less reads |
| Field order stability | Fixed at write‑time | Any order / repeats | Canonical sort by field_id ⇒ deterministic bytes |
| On‑wire overhead | Smallest (no directory) | Very small (1 VarInt tag/field) | Slightly larger (directory ≈ 3‑5 bytes/field) |

:::success Key Points

Imprint pays a few bytes per field to unlock deserialization-free joins,
per‑field projection, and schema‑less tooling—capabilities that matter most
in realtime data manipulation topologies where each record may be routed,
filtered, or merged dozens of times.

:::
