function dataSubmission() {
    // Retrieve input values
    let Username = document.querySelector("#NameField").value;
    let email = document.querySelector("#EmailField").value;
    let address = document.querySelector("#addressField").value; // Fixed id
    let city = document.querySelector("#CityField").value;
    isChecked = document.querySelector("#exampleCheck1").checked;
    // Check if all fields are filled
    if (Username === "" || email === "" || address === "" || city === "") {
        alert("All fields should be filled");
        return; // Exit if any field is empty
    }

    // Validate email
    else if (!email.includes("@") || email.includes(" ")) {
        alert("Write a proper email");
        return; // Exit if email is invalid
    }
    else if (!isChecked) {
        alert("Please check the 'Check me out' box to proceed.");
        return; // Exit if checkbox is not checked
    }

    // Check if the username contains numbers or special characters
    for (let i = 0; i < Username.length; i++) {
        let char = Username.charAt(i);
        if (!isNaN(parseInt(char))) {
            alert("No numbers can be used in the username");
            return; // Exit if username is invalid
        }
    }

    // If all validations pass, log the information to the console
    console.log("Submitted Information:");
    console.log("Username:", Username);
    console.log("Email:", email);
    console.log("Address:", address);
    console.log("City:", city);

    alert("Form submitted successfully!"); // Optional success message
    window.location.href = "new.html";
}

let submit = document.querySelector("#submitButton");
submit.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission for testing
    dataSubmission(); // Call the dataSubmission function
});
