function makeShortUrl() {
	const submitBox = document.getElementById("submit-box");
	
	if (submitBox.value.trim() === '') return;
	
	fetch('/shorten', {
		method: 'POST',
		body: JSON.stringify({ url: submitBox.value }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(r => r.json())
	.then(r => {                
		if (r.status) {
			const showIdElem = document.getElementById("given-id-box");
			// showIdElem.removeChild(showIdElem.lastChild);

			const aElem = document.createElement("a");
			aElem.id = "given-id";
			
			aElem.href = `${window.location.href}${r.code}`;
			aElem.innerHTML = `<span id="grey-text">${window.location.href}</span>${r.code}`;
			aElem.target = "_blank";
			showIdElem.appendChild(aElem);
		
		} else console.log(r.msg);

	});
}