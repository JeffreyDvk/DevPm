import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Modal.scss"

export default function Modal(props){
    
    return <div className={"modal "+(props.show ? 'show' : '')}>
        <div className="modal__content">
            {props.header ? <div className="modal__header">
                {props.header}
                {props.closeButton ? 
                    <button onClick={props.unmountModal} className="modal__close-trigger">
                        <i className="bi bi-x-square"></i>
                    </button> :
                    ''
                }
            </div>: ''}
            <div className="modal__body">
                {props.content}
            </div>
        </div>
    </div>
}
    

Modal.defaultProps = {
    closeButton: true,
  };
