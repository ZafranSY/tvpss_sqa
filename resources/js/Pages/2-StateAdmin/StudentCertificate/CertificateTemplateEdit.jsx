import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Import Link
import { useState } from 'react';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import StateAdminSideBar from '../StateAdminSideBar';

export default function CertificateTemplateEdit({ template }) {
    const { data, setData, post, processing, errors } = useForm({
        color: template.color || '',
        fontSize: '16px', // Default font size
        isBold: false, // Default bold option
        isItalic: false, // Default italic option
        textColor: '#000000', // Default text color
        fontFamily: 'Arial', // Default font family
        numberOfPages: 1, // Default number of pages
    });

    const [textEntries, setTextEntries] = useState({}); // Store text entries for each page
    const [isAddingText, setIsAddingText] = useState(false); // Track if the user is in "Add Text" mode
    const [editingIndex, setEditingIndex] = useState(null); // Track which text entry is being edited
    const [pagesGenerated, setPagesGenerated] = useState(false); // Track if pages have been generated
    const [currentPage, setCurrentPage] = useState(0); // State to track the current page

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('certificate-templates.update', template.id), {
            onSuccess: () => {
                console.log('Template updated successfully!');
            },
        });
    };

    // Function to handle page generation
    const handleGeneratePages = (e) => {
        e.preventDefault();
        setPagesGenerated(true); // Set pages as generated
        setTextEntries({}); // Clear any existing text entries
        setIsAddingText(false); // Exit "Add Text" mode
        setCurrentPage(0); // Reset to the first page
    };

    // Function to handle PDF generation
    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        const totalPages = data.numberOfPages;
        const imagePromises = []; // Array to hold image loading promises
    
        for (let page = 0; page < totalPages; page++) {
            if (template.file_path) {
                const img = new Image();
                img.src = `/storage/${template.file_path}`;
                const imgPromise = new Promise((resolve) => {
                    img.onload = () => {
                        if (page > 0) {
                            doc.addPage(); // Add a new page for every subsequent page
                        }
                        doc.addImage(img, 'JPEG', 0, 0, 210, 297); // Adjust dimensions as needed
    
                        // Add text entries for the current page
                        textEntries[page]?.forEach(entry => {
                            doc.setFontSize(parseInt(entry.fontSize));
                            doc.setTextColor(entry.textColor);
                            doc.text(entry.content, entry.position.x, entry.position.y);
                        });
                        resolve(); // Resolve the promise when the image is loaded and added
                    };
                });
                imagePromises.push(imgPromise); // Add the promise to the array
            }
        }
    
        // Wait for all images to load before saving the PDF
        Promise.all(imagePromises).then(() => {
            doc.save('certificate.pdf'); // Save the PDF after all images are added
        });
    };
    

    // Function to handle click on the preview area
    const handlePreviewClick = (e) => {
        if (!isAddingText) return; // Only proceed if in "Add Text" mode
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // Get x position relative to the preview area
        const y = e.clientY - rect.top; // Get y position relative to the preview area

        // Add the new text entry to the list for the current page
        const newEntry = { 
            content: 'Double-click to edit', // Default content
            position: { x, y }, 
            fontSize: data.fontSize, 
            isBold: data.isBold, 
            isItalic: data.isItalic, 
            textColor: data.textColor, // Use the selected text color
            fontFamily: data.fontFamily,
        };

        setTextEntries((prevEntries) => {
            const currentPageEntries = prevEntries[currentPage] || [];
            return {
                ...prevEntries,
                [currentPage]: [...currentPageEntries, newEntry],
            };
        });
        setIsAddingText(false); // Exit "Add Text" mode
    };

    // Function to handle editing text
    const handleEditText = (index) => {
        setEditingIndex(index);
    };

    // Function to handle text change
    const handleTextChange = (e, index) => {
        setTextEntries((prevEntries) => {
            const currentPageEntries = prevEntries[currentPage] || [];
            const updatedEntries = [...currentPageEntries];
            updatedEntries[index].content = e.target.value;
            return {
                ...prevEntries,
                [currentPage]: updatedEntries,
            };
        });
    };

    // Function to handle dragging text
    const handleDragStart = (index, e) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDrop = (e) => {
        e.preventDefault(); // Prevent default behavior
        const index = e.dataTransfer.getData('text/plain');
        const draggedEntry = textEntries[currentPage][index];

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // Get new x position
        const y = e.clientY - rect.top; // Get new y position

        // Update the position of the dragged text entry
        draggedEntry.position = { x, y };
        setTextEntries((prevEntries) => {
            const currentPageEntries = prevEntries[currentPage] || [];
            const updatedEntries = [...currentPageEntries];
            updatedEntries[index] = draggedEntry; // Update the dragged entry

            return {
                ...prevEntries,
                [currentPage]: updatedEntries,
            };
        });
    };

    // Pagination handlers
    const totalPages = data.numberOfPages; // Total number of pages

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    // Function to handle print preview
    const handlePrintPreview = () => {
        const printWindow = window.open('', '_blank');
    
        // Assuming data.numberOfPages holds the number of pages you need to display
        let pagesHTML = '';
        for (let page = 0; page < data.numberOfPages; page++) {
            const pageContent = textEntries[page]
                ? textEntries[page]
                    .map(entry => `
                        <div class="text-entry" style="
                            position: absolute;
                            top: ${entry.position.y}px;
                            left: ${entry.position.x}px;
                            font-weight: ${entry.isBold ? 'bold' : 'normal'};
                            font-style: ${entry.isItalic ? 'italic' : 'normal'};
                            font-size: ${entry.fontSize};
                            color: ${entry.textColor};
                            font-family: ${entry.fontFamily};
                        ">
                            ${entry.content}
                        </div>`
                    ).join('')
                : '<p>No text entries for this page.</p>';
    
            // Wrap each page's content in a container with page-break styles
            pagesHTML += `
                <div class="page-container">
                    ${
                        template.file_path
                            ? template.file_path.endsWith('.pdf')
                                ? `<iframe src="/storage/${template.file_path}" style="width: 100%; height: 100%; border: none;"></iframe>`
                                : `<img src="/storage/${template.file_path}" style="width: 100%; height: 100%;" alt="Template Preview" />`
                            : '<p>No template file available.</p>'
                    }
                    ${pageContent}
                </div>
            `;
            if (page < data.numberOfPages - 1) {
                pagesHTML += `<div class="page-break"></div>`; // Page break between pages
            }
        }
    
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Preview</title>
                    <style>
                        body {
                            margin: 0;
                            font-family: Arial, sans-serif;
                            color: ${data.textColor};
                            font-size: ${data.fontSize};
                        }
                        .page-container {
                            width: 210mm; /* A4 width */
                            height: 297mm; /* A4 height */
                            position: relative;
                            overflow: hidden;
                            margin: auto;
                            page-break-before: always; /* Forces page break before each page */
                        }
                        .page-break {
                            page-break-before: always; /* Ensures a page break after each content */
                        }
                        .text-entry {
                            position: absolute;
                        }
                    </style>
                </head>
                <body>
                    ${pagesHTML}
                </body>
            </html>
        `);
    
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 10); 
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Sunting Templat" />
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                {/* Sidebar */}
                <div className="w-1/5">
                    <StateAdminSideBar />
                </div>
                {/* Main Content Area */}
                <div className="flex-1 p-8">
                <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/listSchoolCertificate" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Jana Sijil Pelajar
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Sunting Template
                            </li>
                        </ol>
                    </nav>
                <div className="max-w-5xl mx-auto">
                        <Link href={route('certList')} className="mb-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                            Kembali ke Senarai Templat
                        </Link>
                        {!pagesGenerated ? (
                            <form onSubmit={handleGeneratePages} className="flex flex-col">
                                <div className="mt-4">
                                    <label htmlFor="numberOfPages" className="block text-sm font-medium text-gray-700">Jumlah Halaman</label>
                                    <input
                                        type="number"
                                        id="numberOfPages"
                                        value={data.numberOfPages}
                                        onChange={(e) => setData('numberOfPages', e.target.value)}
                                        min="1"
                                        className="mt- 1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-4">
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Hasilkan Halaman
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Templat</label>
                                    <input
                                        type="text"
                                        value={template.name} // Display the template's name
                                        readOnly // Make it read-only
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 bg-gray-100"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Warna Templat</label>
                                    <input
                                        type="color"
                                        id="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Warna Teks</label>
                                    <input
                                        type="color"
                                        id="textColor"
                                        value={data.textColor}
                                        onChange={(e) => setData('textColor', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Format Teks</label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.isBold}
                                            onChange={(e) => setData('isBold', e.target.checked)}
                                        />
                                        <span className="ml-2"> Bold</span>
                                        <input
                                            type="checkbox"
                                            checked={data.isItalic}
                                            onChange={(e) => setData('isItalic', e.target.checked)}
                                            className="ml-4"
                                        />
                                        <span className="ml-2">Italic</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">Font</label>
                                    <select
                                        id="fontFamily"
                                        value={data.fontFamily}
                                        onChange={(e) => setData('fontFamily', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size</label>
                                    <input
                                        type="number"
                                        id="fontSize"
                                        value={parseInt(data.fontSize)} // Convert to integer for input
                                        onChange={(e) => setData('fontSize', e.target.value + 'px')}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-4">
                                    <button type="button" onClick={() => setIsAddingText(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        Tambah Teks
                                    </button>
                                </div>
                                <div className="mt-6">
                                    <button type="button" onClick={handlePrintPreview} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Print Preview
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* File Preview Section */}
                <div className="relative w-1/4 p-4 bg-white border-l border-gray-200">
                    <h3 className="text-lg font-semibold">Preview Templat</h3>
                    {pagesGenerated && (
                        <div className="relative border p-4" style={{ backgroundColor: data.color }} onClick={handlePreviewClick} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                            {/* Render the template file for the current page */}
                            {template.file_path && (
                                template.file_path.endsWith('.pdf') ? (
                                    <iframe
                                        src={`/storage/${template.file_path}`} // Ensure this is correct
                                        className="w-full h-96 border"
                                        title={`Template Preview - Page ${currentPage + 1}`}
                                    />
                                ) : (
                                    <img
                                        src={`/storage/${template.file_path}`} // Ensure this is correct
                                        alt={`Template Preview - Page ${currentPage + 1}`}
                                        className="w-full h-auto"
                                    />
                                )
                            )}
                            {/* Render text entries for the current page */}
                            {textEntries[currentPage]?.map((entry, index) => (
                                <div 
                                    key={index} 
                                    className="absolute" 
                                    style={{ 
                                        top: entry.position.y, 
                                        left: entry.position.x, 
                                        transform: 'translate(-50%, -50%)', 
                                        fontSize: entry.fontSize, 
                                        fontWeight: entry.isBold ? 'bold' : 'normal', 
                                        fontStyle: entry.isItalic ? 'italic' : 'normal', 
                                        color: entry.textColor, 
                                        fontFamily: entry.fontFamily 
                                    }} 
                                    onDoubleClick={() => handleEditText(index)} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(index, e)}
                                >
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={entry.content}
                                            onChange={(e) => handleTextChange(e, index)}
                                            onBlur={() => setEditingIndex(null)} // Exit edit mode on blur
                                            className="border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        entry.content
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Pagination Controls */}
                    {pagesGenerated && (
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={handlePreviousPage} disabled={currentPage === 0} className="bg-gray-300 p-2 rounded">
                                Back
                            </button>
                            <span>
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="bg-gray-300 p-2 rounded">
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
