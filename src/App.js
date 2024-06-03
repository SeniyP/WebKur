import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';

function App() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [excelData, setExcelData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleExcelFileChange = (event) => {
    const excelFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(json);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('template', file);

    const response = await fetch('http://localhost:8000/process.php', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setFields(data.fields);
    } else {
      setFields([]);
    }
  };

  const handleReplace = async () => {
    const formData = new FormData();
    formData.append('template', file);
    formData.append('excelData', JSON.stringify(excelData));

    const response = await fetch('http://localhost:8000/replace.php', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `updated_templates_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="App">
      <h1>Автозаполнение шаблонов Word</h1>
      <form onSubmit={handleSubmit}>
        <label>
        <h2>Загрузите шаблон Word:</h2>
          <input type="file" onChange={handleFileChange} accept=".docx" required />
        </label>
        <button type="submit">Найти поля (необязательно)</button>
      </form>
      <div className="fields">
        <h2>Найденые поля:</h2>
        <ul>
          {fields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </div>
      <div className="excel-upload">
        <h2>Загрузите данные Excel:</h2>
        <input type="file" onChange={handleExcelFileChange} accept=".xlsx, .xls" />
      </div>
      <button onClick={handleReplace}>Скачать</button>
    </div>
  );
}

export default App;
