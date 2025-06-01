import React from 'react';

function Footer(): JSX.Element | null {
  return (
      <div className={'w-full py-5 px-5 border-t border-gray-200'}>
        <div className={'flex justify-between items-center'}>
          <div className={'flex flex-col justify-between'}>
            <div className={'grid grid-cols-2'}></div>
            <div className={'text-gray-500 text-sm'}>
              Copyright © {new Date().getFullYear()} Imprint Serde Authors. All rights reserved.
            </div>
          </div>
          <div className={'pl-5'}>
            <img src={'/img/imprint-logo-full.svg'} height={30} width={100} alt={'Imprint Serde'}/>
          </div>
        </div>
      </div>
  );
}

export default React.memo(Footer);