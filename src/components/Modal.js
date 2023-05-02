import React, { useRef, useState } from 'react'

const Modal = ({setOpen, selectedImage, setSelectedImage, generate}) => {
    const ref = useRef(null)
    const [error, setError] = useState(null)
    const closeModal = () => {
        setOpen(false)
        setSelectedImage(null)
    }

    const checkSize = () => {
        if(ref.current.width == 256 && ref.current.height == 256){
            generate()
        }else{
            setError("Choose a 256 x 256px image")
        }
    }
    return (
      <div className="modal">
        <div onClick={closeModal}>✖</div>
        <div className="img-container">
          {selectedImage && (
            <img
              ref={ref}
              src={URL.createObjectURL(selectedImage)}
              alt="SELECTED_IMAGE"
            />
          )}
        </div>
        <p>{error || "* Image must be 256x256px"}</p>
        {!error ? (
          <button onClick={checkSize}>Generate</button>
        ) : (
          <button onClick={closeModal}>Close this and try again</button>
        )}
      </div>
    );
}

export default Modal