function getCurrentTimeAMPM() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const hours12 = hours % 12 || 12;
  
    const currentTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return currentTime;
  }
  
  function convertEscapeSequencesToHtml(text) {
    return text
        .replace(/\\n/g, '<br>') // Newline to HTML line break
        .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Tab to HTML non-breaking space (4 spaces)
        .replace(/\\'/g, '&#39;') // Single quote to HTML entity
        .replace(/\\"/g, '&quot;') // Double quote to HTML entity
        .replace(/\\\\/g, '&#92;') // Backslash to HTML entity
        .replace(/\\r/g, '') // Remove carriage return
        .replace(/\\u([0-9A-Fa-f]{4,5})/g, function(match, group1) {
            const codePoint = parseInt(group1, 16);
            return String.fromCodePoint(codePoint);
        });
}

function sendResponse()
{
    respTex = document.getElementById("exampleFormControlInput1");
    respText = respTex.value;
    url = "http://210.212.253.250/api/chat/"+respText
    modalBody = document.getElementById("modal-body");
    modalBody.innerHTML += `<div class="d-flex flex-row justify-content-start" style="width: 100%;color: var(--bs-emphasis-color);"><i class="fas fa-user" style="font-size: 32px;color: var(--bs-body-bg);"></i>
    <div style="color: var(--bs-emphasis-color);">
        <p class="text-white small p-2 ms-3 mb-1 rounded-3" style="word-wrap: break-word;width: 300px;color: var(--bs-secondary-bg);background: rgba(245,246,247,0.32);">${respText}</p>
        <p class="small ms-3 mb-3 rounded-3" style="color: var(--bs-secondary-bg);">${getCurrentTimeAMPM()}</p>
    </div>
</div>`
modalBody.innerHTML += `<div id='typing' class="d-flex flex-row justify-content-end mb-4 pt-1" style="width: 100%;color: var(--bs-emphasis-color);">
<div style="color: var(--bs-emphasis-color);">
    <p class="text-white bg-primary small p-2 me-3 mb-1 rounded-3" style="background-color: #f5f6f7;word-wrap: break-word;width: 300px;color: var(--bs-secondary-bg);">Typing...</p>
</div><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-robot" style="font-size: 32px;color: var(--bs-body-bg);">
    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"></path>
    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"></path>
</svg>
</div>`
typing  = document.getElementById("typing");
document.getElementById("exampleFormControlInput1").value = "";
respTex.disabled = true;
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    fetchedData = data;
    data = data.slice(1, -2)
    data = convertEscapeSequencesToHtml(data)
    console.log(data);
    typing.remove();
    modalBody.innerHTML += `<div class="d-flex flex-row justify-content-end mb-4 pt-1" style="width: 100%;color: var(--bs-emphasis-color);">
    <div style="color: var(--bs-emphasis-color);">
        <p class="text-white bg-primary small p-2 me-3 mb-1 rounded-3" style="background-color: #f5f6f7;word-wrap: break-word;width: 300px;color: var(--bs-secondary-bg);">${data}</p>
        <p class="d-flex justify-content-end small me-3 mb-3 rounded-3" style="color: var(--bs-body-bg);">${getCurrentTimeAMPM()}</p>
    </div><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-robot" style="font-size: 32px;color: var(--bs-body-bg);">
        <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"></path>
        <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"></path>
    </svg>
</div>`
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
  respTex.disabled = false;
}