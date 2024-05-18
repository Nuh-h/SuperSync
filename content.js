let dialog, form, closeButton;

if (!document.querySelector("dialog.supersync-dialog")) {
    document.body.innerHTML += `<style>
    dialog {
      color: #ffffff;
      position: fixed;
      margin-top: 2rem;
      filter: drop-shadow(2px 4px 6px black);
    }
  
    .form-container {
      background-color: #333333;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 80%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
    .form-container label {
      display: block;
    }
  
    .form-container input[type="text"] {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #1a1a1a;
      color: #ffffff;
    }
  
    .form-container input[type="submit"] {
      background-color: #007acc;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .supersync-dialog button.close {
        background: transparent;
        width: max-content;
        color: inherit;
        border-color: inherit;
        display: flex;
        align-self: end;
        gap: 0.3rem;
        padding: 0.5rem;
    }
    .supersync-dialog svg {
        width: 1rem;
        height: 1rem;
        align-self: center;
    }
  </style>
  <dialog class="form-container supersync-dialog">
    <button class="close"><span>Close</span><svg fill="currentColor" width="800px" height="800px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zm181.008-630.016c-12.496-12.496-32.752-12.496-45.248 0L512 466.752l-135.76-135.76c-12.496-12.496-32.752-12.496-45.264 0-12.496 12.496-12.496 32.752 0 45.248L466.736 512l-135.76 135.76c-12.496 12.48-12.496 32.769 0 45.249 12.496 12.496 32.752 12.496 45.264 0L512 557.249l135.76 135.76c12.496 12.496 32.752 12.496 45.248 0 12.496-12.48 12.496-32.769 0-45.249L557.248 512l135.76-135.76c12.512-12.512 12.512-32.768 0-45.248z"/></svg></span></button>
    <p>Keep your Synergist in Sync, tell us what you are doing now. Last thing you did was: fixing bugs.</p>
    <form>
      <label for="activity">What are you doing now?</label>
      <input type="text" id="activity" name="activity" required>
      <input type="submit" value="Submit">
    </form>
  </dialog>`

    dialog = document.querySelector(".supersync-dialog");
    form = dialog.querySelector("form");
    closeButton = dialog.querySelector("button.close");

    form.addEventListener("submit", (e) => {
        let userInput = form.querySelector("#activity").value;
        if (userInput && userInput.length > 0) {
            chrome.storage.local.set({ [(new Date()).toISOString()]: userInput }).then(() => {
                console.log("note saved");
            });
        }
        dialog.close();
        e.preventDefault()
    });

    closeButton.addEventListener("click", () => {
        dialog.close();
    })
}

if (dialog && !dialog.open) {
    dialog.showModal();
}
