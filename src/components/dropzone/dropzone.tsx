import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';
import './styles.css';
import { FileUpload }from '../../interfaces/FileUpload'

const Dropzone: React.FC<FileUpload> = ({ onFileUpload }) => {

  const [selectedImage, setSelectedImage] = useState('');
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedImage(fileUrl);
    onFileUpload(file);

  }, [ onFileUpload ]);

  const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: 'image/*'
    });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      { 
        selectedImage
         ? <img src={ selectedImage } alt="Point img"/>
         : (
            <p>
                <FiUpload />
                Imagem do estabelecimento
            </p>
         )

      }
        
    </div>
  );
};

export default Dropzone;