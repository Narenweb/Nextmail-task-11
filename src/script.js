import './sass/main.scss';
import jsonData from './emailData';
document.addEventListener('DOMContentLoaded', () => {

    //Searching functionality
    const searchInput = document.querySelector('.search-input');
    const emailContainers = document.querySelectorAll('.item');
    const noMatchingMessage = document.querySelector('.no-matching-message');

    searchInput.addEventListener('keyup', () => {

        const filter = searchInput.value.toLowerCase();
        let hasMatch = false;

        emailContainers.forEach(container => {
            const subject = container.getAttribute('data-subject');
            const name = container.getAttribute('data-name');

            if ((subject && subject.toLowerCase().includes(filter)) || (name && name.toLowerCase().includes(filter))) {
                container.style.display = 'flex';
                hasMatch = true;
            } else {
                container.style.display = 'none';
            }
        });

        if (hasMatch) {
            noMatchingMessage.style.display = 'none';
        } else {
            noMatchingMessage.style.display = 'block';
        }
    });

    function getData() {
        let inpVal = searchInput.value;
        console.log(inpVal);
    }

    function debouncing(func, delay) {
        let timer;
        return function () {
            let context = this;
            let args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        }
    }

    const better = debouncing(getData, 300);
    searchInput.addEventListener("keyup", better);
    
    //It will add the file icon based on the type.
    function getAttachmentIconSrc(fileType) {
        switch (fileType) {
            case 'pdf':
                return 'https://i.postimg.cc/Y9JcNL75/pdf.png';
            case 'word':
                return 'https://i.postimg.cc/15WdDYQk/word.png';
            default:
                return 'None';
        }
    }

    function displayEmailContent(emailId) {
        const email = jsonData.emails.find(email => email.id === parseInt(emailId));

        if (email) {

            const contentDiv = document.getElementById('emailList');
            contentDiv.innerHTML = `
                    <h2 class="sub">${email.subject}</h2>
                    <div class="profile-card">
                        <div class="small-profile-details">
                            <img src="${email.profileImage}" alt="profile" class="small-profile">
                            <div class="user-details">
                                <h2 class="user-name">${email.name}</h2>
                                <p class="mail">${email.email}</p>
                            </div>
                        </div>
                        <span class="fetch-time">${email.fetchTime}</span>
                    </div>
                    <p class="data-content">${email.content}</p>
                    <hr class="line">
                    ${email.attachment ? `
                    <div class="file-container">
                        <div class="file-icon">
                            <img src="${getAttachmentIconSrc(email.fileType)}" alt="${email.fileType}">
                        </div>
                        <p class="file-name">${email.fileName}</p>
                    </div>
                ` : ''}
                `;
            const profileDetails = document.querySelector('.small-profile-details');
            const profileImage = profileDetails.querySelector('.small-profile');
            const userName = profileDetails.querySelector('.user-name');
            const userEmail = profileDetails.querySelector('.mail');

            profileImage.src = email.profileImage;
            userName.textContent = email.name;
            userEmail.textContent = email.email;



        }
    }


    // Get all flex-container elements with dot and border while clicking
    const flexContainers = document.querySelectorAll('.item');
    flexContainers[1].style.backgroundColor = "white";
    flexContainers[1].style.borderLeft = "3px solid #379aff";
    let lastClickedContainer = flexContainers[1];
    flexContainers.forEach((container, index) => {

        const timeAttachmentDiv = container.querySelector('.time-attachment');
        if (timeAttachmentDiv) {
            const attachmentIconDiv = timeAttachmentDiv.querySelector('.attachment');
            if (attachmentIconDiv) {
                const emailId = container.getAttribute('data-email-id');
                const email = jsonData.emails.find(email => email.id === parseInt(emailId));

                if (email && email.attachment) {
                    attachmentIconDiv.style.display = 'block';
                } else {
                    attachmentIconDiv.style.display = 'none';
                }
            }
        }
        if (index > 0) {
            container.addEventListener('click', () => {
                const emailId = container.getAttribute('data-email-id');
                displayEmailContent(emailId);
                const blueDot = container.querySelector('.blue-dot');
                const subject = container.querySelector('.subject');
                if (blueDot) {
                    blueDot.style.visibility = 'hidden';
                }
                if (lastClickedContainer) {
                    lastClickedContainer.style.backgroundColor = '';
                    lastClickedContainer.style.borderLeft = "3px solid transparent";
                }
                container.style.backgroundColor = 'white';
                container.style.borderLeft = '3px solid #379aff'
                lastClickedContainer = container;

            });

        }
    });
    window.addEventListener('load', () => {
        displayEmailContent("1");
    });
})
