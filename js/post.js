document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (!postId) {
        alert('Postagem não encontrada.');
        window.location.href = '/html/perfil.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!response.ok) throw new Error('Erro ao carregar a postagem');

        const post = await response.json();
        const postDetails = document.getElementById('post-details');

        postDetails.innerHTML = `
            <h2>${post.title}</h2>
            <img src="${post.image || 'https://via.placeholder.com/400'}" class="img-fluid" alt="Postagem">
            <p>${post.content}</p>
            <p><strong>Likes:</strong> ${post.likes}</p>
        `;

        // Carregar comentários diretamente da postagem
        loadComments(post.comments);

        document.getElementById('submit-comment').addEventListener('click', async () => {
            const commentInput = document.getElementById('comment-input');
            const newComment = commentInput.value;

            if (newComment.trim()) {
                const commentsContainer = document.getElementById('comments-container');
                const commentElement = document.createElement('p');
                commentElement.textContent = newComment;
                commentsContainer.appendChild(commentElement);

                // Atualiza a postagem no backend
                post.comments.push(newComment); // Adiciona o novo comentário

                await fetch(`http://localhost:3000/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...post,
                        quantComent: post.comments.length // Atualiza a contagem de comentários
                    })
                });

                commentInput.value = ''; 
            } else {
                alert('Por favor, digite um comentário.');
            }
        });

    } catch (error) {
        console.error('Erro ao carregar a postagem:', error);
        alert('Ocorreu um erro ao carregar a postagem. Tente novamente mais tarde.');
    }
});

function loadComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment;
        commentsContainer.appendChild(commentElement);
    });
}
