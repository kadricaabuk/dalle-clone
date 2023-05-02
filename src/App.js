import { useEffect, useState } from "react";
import Modal from "./components/Modal";

const App = () => {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)

  const surpriseOptions = [
    "A blue ostrich eating melon",
    "A mattise style shark on the telephone",
    "A pineapple sunbathing on an islandc ",
  ];

  const getImages = async () => {
    setImages(null);
    if (value === "") setError("Error! Must have a search term.");
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const surpriseMe = () => {
    setImages(null);
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  
  const uploadImage = async (e) => {
    e.preventDefault();
    
    const formData = new FormData()
    
    formData.append("file", e.target.files[0])

    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json()
      if(data.success){
        setModalOpen(true)
        setSelectedImage(e.target.files[0])
        e.target.value = null
      }
    } catch (error) {
      console.error(error)
    }
  }


  const generateVariations = async () => {
    setImages(null)
    if(selectedImage === null){
      setError("Error! Must have an existing image")
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: "POST"
      }
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json()
      console.log(data);
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start with a detailed description{" "}
          <span className="surprise" onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            placeholder="An impressionist oil painting of a sunflower in purple vase..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or, <span>
            <label htmlFor="files">
              Upload an image
            </label>
            <input onChange={uploadImage} type="file" id="files" accept="image/0" hidden/>
          </span>
          {" "}to edit.
        </p>
        {error && <p className="error">{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal setOpen={setModalOpen} setSelectedImage={setSelectedImage} selectedImage={selectedImage} generate={generateVariations}/>
        </div>}
      </section>
      <section className="image-section">
        {images?.map((img, _id) => (
          <img key={_id} src={img.url} alt={`Generated of ${value}`} />
        ))}
      </section>
    </div>
  );
};

export default App;
