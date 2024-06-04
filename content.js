let dialog, form, closeButton, lastStatus;

// Function to initialise the dialog and its elements
function initialiseDialog() {
  if (!document.querySelector("dialog.supersync-dialog")) {
    const dialogHTML = `
      <style>

        dialog {
          color: #ffffff;
          margin-top: 2rem;
          filter: drop-shadow(2px 4px 6px black);
        }

        dialog:not(open) {
          z-index: auto;
        }

        .form-container {
          background-color: #333333;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 80%;
          max-width: 500px;
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
        <p>Keep your Synergist in Sync, let me know what you are doing so I will remind you later.</p>
        <p>Last thing you did was: <bold id="last-item"></bold>.</p>
        <form>
          <label for="activity">What are you doing now?</label>
          <input type="text" id="activity" name="activity" required>
          <input type="submit" value="Submit">
        </form>
      </dialog>
    `;

    document.body.innerHTML += dialogHTML;

    dialog = document.querySelector(".supersync-dialog");
    form = dialog.querySelector("form");
    closeButton = dialog.querySelector("button.close");

    form.addEventListener("submit", handleFormSubmit);
    closeButton.addEventListener("click", () => dialog.close());
  }
}

// Function to handle form submission
function handleFormSubmit(e) {
  const userInput = form.querySelector("#activity").value;
  if (userInput && userInput.length > 0) {
    const timestamp = new Date().toISOString();
    chrome.storage.local.set({ [timestamp]: userInput })
      .then(() => {
        console.log("Note saved");
        chrome.storage.local.set({ "lastItem": userInput });
        chrome.runtime.sendMessage({ type: 'storageUpdated', data: undefined });
      })
      .catch(console.error);
  }
  dialog.close();
  e.preventDefault();
}

// Load the last status from storage
chrome.storage.local.get().then(items => {
  lastStatus = items["lastItem"];
  if (dialog) {
    dialog.querySelector("#last-item").innerHTML = lastStatus || "N/A";
  }
}).catch(console.error);

// Initialise the dialog
initialiseDialog();

// Show the dialog if it's not already open
if (dialog && !dialog.open) {
  dialog.showModal();
}
