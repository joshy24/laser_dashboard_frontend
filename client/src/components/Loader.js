import React from 'react';

import ReactModal from 'react-modal';

import BarLoader from 'react-spinners/BarLoader';

import MoonLoader from 'react-spinners/MoonLoader';

ReactModal.setAppElement('#main');

const override = {
    display: "block",
    margin: "0 auto",
    border: "0px solid #000000"
}

export default function Loader(props){
    return  <div>
                <ReactModal 
                    isOpen={props.isLoading}
                    className="LoadingModal"
                    overlayClassName="LoadingOverlay"
                    contentLabel="Minimal Modal Example">

                    <MoonLoader
                        css={override}
                        sizeUnit={"px"}
                        size={80}
                        color={'#2E86C1'}
                        loading={props.isLoading}
                    />

                    <h4 className="text-center">Please Wait</h4>

                </ReactModal>
            </div>
}