import { useState } from "react";

export default function FileUpload({ setUploadedFile }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileURL = URL.createObjectURL(selectedFile);
            setFile(fileURL);

            if (typeof setUploadedFile === "function") {
                setUploadedFile(fileURL);
            } else {
                console.error("Error: setUploadedFile is not a function");
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} className="text-sm text-gray-600" />
            {file && <p className="text-xs text-green-600 mt-1">Uploaded: {file}</p>}
        </div>
    );
}
