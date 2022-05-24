import React from 'react';

import ReactModal from 'react-modal';

ReactModal.setAppElement('#main');

const btn_style_left = {
    marginLeft: "16px",
    marginRight: "8px"
}

const btn_style_right = {
    marginLeft: "8px",
    marginRight: "16px"
}

export default function ConfirmAddressNotFound(props){
    return  <div>
                <ReactModal 
                    isOpen={true}
                    className="ConfirmModal"
                    overlayClassName="Overlay"
                    contentLabel="Minimal Modal Example">
                    <h4 className="text-center blue-text">Address Not Found</h4>
                    <br/>
                    <h5 className="text-center">An Error occurred while attempting to locate that address. It could be that the address is wrong.</h5>
                    <br/>
                    <button className="laser-inline laser-red-bg laserbtn" style={btn_style_right} onClick={props.tryAgainClicked}>retry</button>
                    <button className="laser-inline laser-grey-bg laserbtn" style={btn_style_left} onClick={props.closeConfirmAddressNotFoundClicked}>cancel</button>
                </ReactModal>
            </div>
}