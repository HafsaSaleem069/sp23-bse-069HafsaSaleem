document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const postList = document.getElementById('postList');
    const postForm = document.getElementById('postForm');
    const postIdField = document.getElementById('postId');
    const titleField = document.getElementById('title');
    const bodyField = document.getElementById('body');
    const submitButton = document.getElementById('submitButton');

    // READ: Fetch all posts when page loads
    function fetchPosts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(posts => {
                postList.innerHTML = ''; // Clear the list
                posts.slice(0, 5).forEach(post => {  // Limit to 5 posts for simplicity
                    addPostToDOM(post); // Function to display each post in the DOM
                });
            });
    }

    // Function to add a post to the DOM
    function addPostToDOM(post) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.setAttribute('data-id', post.id); // Set a data attribute for post ID
        li.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>
            <button class="btn btn-secondary btn-sm" onclick="editPost(${post.id})">Edit</button>
        `;
        postList.appendChild(li);
    }

    // CREATE/UPDATE: Submit form to create a new post or update an existing post
    postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const postId = postIdField.value;
        const postData = {
            title: titleField.value,
            body: bodyField.value,
            userId: 1 // Assuming a default userId
        };

        const method = postId ? 'PUT' : 'POST';
        const url = postId ? `${apiUrl}/${postId}` : apiUrl;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                if (!postId) {
                    // For create (POST), add the post directly to the DOM
                    data.id = Date.now(); // Temporarily set a unique ID for the new post
                    addPostToDOM(data);
                } else {
                    // For update (PUT), update the existing post in the DOM
                    const existingPost = document.querySelector(`li[data-id='${postId}']`);
                    existingPost.querySelector('strong').innerText = data.title;
                    existingPost.querySelector('p').innerText = data.body;
                }

                postForm.reset(); // Clear form
                postIdField.value = ''; // Reset hidden field
                submitButton.innerText = 'Create Post'; // Reset button text
            });
    });

    // DELETE: Delete a post
    window.deletePost = function (id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Remove the post from the DOM
                    const postToRemove = document.querySelector(`li[data-id='${id}']`);
                    postToRemove.remove();
                }
            });
    };

    // UPDATE: Populate form fields for editing a post
    window.editPost = function (id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(post => {
                postIdField.value = post.id;
                titleField.value = post.title;
                bodyField.value = post.body;
                submitButton.innerText = 'Update Post'; // Change button text
            });
    };

    // Fetch all posts on initial load
    fetchPosts();
});
