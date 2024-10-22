import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Eye, X } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-text-editor">
      <div
        className="w-full p-2 border rounded min-h-[200px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={(e) => onChange(e.target.innerHTML)}
        placeholder={placeholder}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Cover Letter Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const CoverLetterBuilder = () => {
  const [coverLetterInfo, setCoverLetterInfo] = useState({
    recipientName: '',
    recipientTitle: '',
    companyName: '',
    companyAddress: '',
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    senderEmail: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    greeting: '',
    opening: '',
    body: '',
    closing: '',
    signature: '',
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const coverLetterRef = useRef();

  const handleInfoChange = (e) => {
    setCoverLetterInfo({ ...coverLetterInfo, [e.target.name]: e.target.value });
  };

  const handleContentChange = (field, value) => {
    setCoverLetterInfo({ ...coverLetterInfo, [field]: value });
  };

  const handlePrint = useReactToPrint({
    content: () => coverLetterRef.current,
  });

  const handleShare = async () => {
    const canvas = await html2canvas(coverLetterRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Cover Letter',
          text: 'Check out my cover letter!',
          files: [new File([await (await fetch(imgData)).blob()], 'cover-letter.png', { type: 'image/png' })],
        });
        console.log('Cover letter shared successfully');
      } catch (error) {
        console.error('Error sharing cover letter:', error);
      }
    } else {
      console.log('Web Share API not supported');
      // Fallback: You could implement a modal to show a shareable link or QR code here
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
  
    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
  
    const addText = (text, x, y, maxWidth, fontSize = 12, fontStyle = "normal") => {
      pdf.setFontSize(fontSize);
      pdf.setFont("times", fontStyle);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.3528);
    };
  
    let yPos = margin;
  
    // Sender's information
    yPos = addText(coverLetterInfo.senderName, margin, yPos, pageWidth - 2*margin, 12, "bold");
    yPos = addText(coverLetterInfo.senderAddress, margin, yPos, pageWidth - 2*margin);
    yPos = addText(coverLetterInfo.senderPhone, margin, yPos, pageWidth - 2*margin);
    yPos = addText(coverLetterInfo.senderEmail, margin, yPos, pageWidth - 2*margin);
  
    yPos += 10;
  
    // Date
    yPos = addText(coverLetterInfo.date, margin, yPos, pageWidth - 2*margin);
  
    yPos += 10;
  
    // Recipient's information
    yPos = addText(coverLetterInfo.recipientName, margin, yPos, pageWidth - 2*margin);
    yPos = addText(coverLetterInfo.recipientTitle, margin, yPos, pageWidth - 2*margin);
    yPos = addText(coverLetterInfo.companyName, margin, yPos, pageWidth - 2*margin);
    yPos = addText(coverLetterInfo.companyAddress, margin, yPos, pageWidth - 2*margin);
  
    yPos += 10;
  
    // Subject
    yPos = addText(`Subject: ${coverLetterInfo.subject}`, margin, yPos, pageWidth - 2*margin, 12, "bold");
  
    yPos += 10;
  
    // Greeting
    yPos = addText(coverLetterInfo.greeting, margin, yPos, pageWidth - 2*margin);
  
    yPos += 5;
  
    // Content
    yPos = addText(coverLetterInfo.opening.replace(/<[^>]*>/g, ''), margin, yPos, pageWidth - 2*margin);
    yPos += 5;
    yPos = addText(coverLetterInfo.body.replace(/<[^>]*>/g, ''), margin, yPos, pageWidth - 2*margin);
    yPos += 5;
    yPos = addText(coverLetterInfo.closing.replace(/<[^>]*>/g, ''), margin, yPos, pageWidth - 2*margin);
  
    yPos += 10;
  
    // Signature
    yPos = addText(coverLetterInfo.signature, margin, yPos, pageWidth - 2*margin);
  
    pdf.save('cover-letter.pdf');
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const CoverLetterPreview = () => (
    <div ref={coverLetterRef} className="bg-white p-8 shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mb-6">
        <p className="font-bold">{coverLetterInfo.senderName}</p>
        <p>{coverLetterInfo.senderAddress}</p>
        <p>{coverLetterInfo.senderPhone}</p>
        <p>{coverLetterInfo.senderEmail}</p>
      </div>
      <p className="mb-4">{coverLetterInfo.date}</p>
      <div className="mb-6">
        <p>{coverLetterInfo.recipientName}</p>
        <p>{coverLetterInfo.recipientTitle}</p>
        <p>{coverLetterInfo.companyName}</p>
        <p>{coverLetterInfo.companyAddress}</p>
      </div>
      <p className="font-bold mb-4">Subject: {coverLetterInfo.subject}</p>
      <p className="mb-4">{coverLetterInfo.greeting}</p>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: coverLetterInfo.opening }}></div>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: coverLetterInfo.body }}></div>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: coverLetterInfo.closing }}></div>
      <p>{coverLetterInfo.signature}</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Cover Letter Builder</h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h2 className="text-xl font-semibold mb-2">Sender Information</h2>
                <input
                  type="text"
                  name="senderName"
                  placeholder="Your Name"
                  value={coverLetterInfo.senderName}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="senderAddress"
                  placeholder="Your Address"
                  value={coverLetterInfo.senderAddress}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="tel"
                  name="senderPhone"
                  placeholder="Your Phone"
                  value={coverLetterInfo.senderPhone}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="email"
                  name="senderEmail"
                  placeholder="Your Email"
                  value={coverLetterInfo.senderEmail}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Recipient Information</h2>
                <input
                  type="text"
                  name="recipientName"
                  placeholder="Recipient's Name"
                  value={coverLetterInfo.recipientName}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="recipientTitle"
                  placeholder="Recipient's Title"
                  value={coverLetterInfo.recipientTitle}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={coverLetterInfo.companyName}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="companyAddress"
                  placeholder="Company Address"
                  value={coverLetterInfo.companyAddress}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Letter Details</h2>
                <input
                  type="date"
                  name="date"
                  value={coverLetterInfo.date}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={coverLetterInfo.subject}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="greeting"
                  placeholder="Greeting (e.g., Dear Mr. Smith,)"
                  value={coverLetterInfo.greeting}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Letter Content</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">Opening Paragraph</h3>
                <RichTextEditor
                  value={coverLetterInfo.opening}
                  onChange={(value) => handleContentChange('opening', value)}
                  placeholder="Introduce yourself and state the position you're applying for..."
                />
                <h3 className="text-lg font-semibold mt-4 mb-2">Body Paragraphs</h3>
                <RichTextEditor
                  value={coverLetterInfo.body}
                  onChange={(value) => handleContentChange('body', value)}
                  placeholder="Highlight your relevant skills and experiences..."
                />
                <h3 className="text-lg font-semibold mt-4 mb-2">Closing Paragraph</h3>
                <RichTextEditor
                  value={coverLetterInfo.closing}
                  onChange={(value) => handleContentChange('closing', value)}
                  placeholder="Thank the recipient and express your interest in an interview..."
                />
                <input
                  type="text"
                  name="signature"
                  placeholder="Signature (e.g., Sincerely, [Your Name])"
                  value={coverLetterInfo.signature}
                  onChange={handleInfoChange}
                  className="w-full p-2 border rounded mt-4"
                />
              </div>
            </div>

            {/* Preview Section (visible only on larger screens) */}
            <div className="hidden xl:block bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Cover Letter Preview</h2>
              <CoverLetterPreview />
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={handleShare}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Preview Toggle */}
      {/* Mobile Preview Toggle */}
      <button
        onClick={togglePreview}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg xl:hidden"
        aria-label="Open Preview"
      >
        <Eye size={24} />
      </button>
      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <CoverLetterPreview />
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Print
          </button>
          <button
            onClick={handleShare}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Share
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CoverLetterBuilder;