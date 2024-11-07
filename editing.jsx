import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        try {
            // Step 1: Request signature and timestamp from the backend
            const response = await axios.post('http://localhost:7000/generate-signature');
            const { signature, timestamp } = response.data;

            // Step 2: Prepare the form data for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // unsigned preset from Cloudinary
            formData.append('api_key', 'YOUR_API_KEY'); // Cloudinary API Key
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            // Step 3: Upload image to Cloudinary
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
                formData
            );

            setImageUrl(cloudinaryResponse.data.secure_url);
            alert('Image uploaded successfully!');

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image.');
        }
    };

    return (
        <div>
            <h1>Upload Image to Cloudinary</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>

            {imageUrl && (
                <div>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos nesciunt quod in magnam hic inventore voluptates facere, voluptatem a autem voluptatibus natus doloribus quis, aperiam eos, maiores iure provident obcaecati. Perferendis autem neque suscipit.
                    <h3>Uploaded Image:</h3>
                    <img src={imageUrl} alt="Uploaded" style={{ width: '300px' }} />
                </div>
            )}
        </div>
    );
};

export default App;