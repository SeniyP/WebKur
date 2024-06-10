import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';

function App() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('home');

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
      <h1>Word Template Fields Extractor</h1>
      <nav>
        <ul className="menu">
          <li
            className={activeMenuItem === 'home' ? 'active' : ''}
            onClick={() => setActiveMenuItem('home')}
          >
            Главная
          </li>
          <li
            className={activeMenuItem === 'templates' ? 'active' : ''}
            onClick={() => setActiveMenuItem('templates')}
          >
            Шаблоны
          </li>
          <li
            className={activeMenuItem === 'autofill' ? 'active' : ''}
            onClick={() => setActiveMenuItem('autofill')}
          >
            Автозаполнение
          </li>
        </ul>
      </nav>
      {activeMenuItem === 'home' && (
        <div className="welcome-text">
          <p>
            Добро пожаловать в приложение для автозаполнения шаблонов Word!
          </p>
          <p>
            Чтобы ознакомиться с примерами шаблонов и научиться их составлять, перейдите во вкладку "Шаблоны".
          </p>
          <p>
            Чтобы начать заполнение, перейдите в раздел "Автозаполнение".
          </p>
          <p>
            Для ознакомления с проектом посетите репозиторий на GitHub: <a href="https://github.com/SeniyP/WebKur">https://github.com/SeniyP/WebKur</a>.
          </p>
        </div>
      )}
      {activeMenuItem === 'templates' && (
        <div className="templates-instructions">
          <h2>Инструкции по составлению шаблонов:</h2>
          <p>
            1. Откройте Microsoft Word и создайте новый документ.
          </p>
          <p>
            2. Добавьте необходимые текстовые элементы, которые будут использоваться для автозаполнения.
          </p>
          <p>
            3. Отмечайте каждое поле для автозаполнения в квадратных скобках. Например, **Имя пользователя**.
          </p>
          <p>
            4. Сохраните документ в формате .docx.
          </p>
          <p>
            5. Загрузите ваш шаблон в приложение и нажмите "Извлечь поля".
          </p>
          <div className="templates">
          <h2>Скачать шаблон:</h2>
          <a href="https://docs.google.com/document/d/1aKtVFpP8ITfHjHO6b1aFKZ4q_E7JQe0v/edit">
            Скачать TEST.docx
          </a>
        </div>
        </div>
      )}
      {activeMenuItem === 'autofill' && (
        <form onSubmit={handleSubmit}>
          <label>
            Загрузите шаблон Word:
            <input type="file" onChange={handleFileChange} accept=".docx" required />
          </label>
          <button type="submit">Извлечь поля</button>
        </form>
      )}
      {activeMenuItem === 'autofill' && (
        <div className="fields">
          <h2>Извлеченные поля:</h2>
          <ul>
            {fields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}
      {activeMenuItem === 'autofill' && (
        <div className="excel-upload">
          <h2>Загрузите данные Excel:</h2>
          <input type="file" onChange={handleExcelFileChange} accept=".xlsx, .xls" />
        </div>
      )}
      {activeMenuItem === 'autofill' && <button onClick={handleReplace}>Заменить поля</button>}
    </div>
  );
}

export default App;
