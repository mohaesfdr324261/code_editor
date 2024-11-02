const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlCode'), {
    mode: 'htmlmixed',
    lineNumbers: true,
    theme: 'dracula',
    matchBrackets: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssCode'), {
    mode: 'css',
    lineNumbers: true,
    theme: 'dracula',
    matchBrackets: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsCode'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'dracula',
    matchBrackets: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
});

let versionHistory = [];

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const type = tab.getAttribute('data-type');
        document.querySelectorAll('.editor-section').forEach(section => {
            section.classList.add('hidden');
        });

        document.querySelector(`.editor-section:nth-of-type(${["html", "css", "js"].indexOf(type) + 1})`).classList.remove('hidden');
    });
});

function updatePreview() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();
    const outputFrame = document.getElementById('output');

    const output = `
        <html>
            <head>
                <style>
                    ${cssCode}
                </style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    try {
                        ${jsCode}
                    } catch (error) {
                        console.error(error);
                        alert('خطأ في الشيفرة: ' + error.message);
                    }
                </script>
            </body>
        </html>
    `;

    outputFrame.srcdoc = output;
}

document.getElementById('runCode').addEventListener('click', () => {
    updatePreview();
    saveVersion();
});

document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', updatePreview);
});

function saveFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('saveProject').addEventListener('click', function() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    const projectContent = `HTML:
${htmlCode}

CSS:
${cssCode}

JavaScript:
${jsCode}`;
    saveFile(projectContent, 'project.exe');
});

function saveVersion() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    versionHistory.push({ htmlCode, cssCode, jsCode });
    alert('تم حفظ النسخة بنجاح!');
}

document.getElementById('versionControl').addEventListener('click', () => {
    if (versionHistory.length === 0) {
        alert('لا توجد نسخ سابقة.');
        return;
    }
    const versions = versionHistory.map((version, index) => `نسخة ${index + 1}:\n\nHTML:\n${version.htmlCode}\n\nCSS:\n${version.cssCode}\n\nJavaScript:\n${version.jsCode}`).join('\n\n');
    alert(versions);
});