document.addEventListener('DOMContentLoaded', async () => {
    try {
        const responsePosts = await fetch('http://localhost:3000/posts');
        const posts = await responsePosts.json();
        
        const responseUsers = await fetch('http://localhost:3000/users');
        const users = await responseUsers.json();

        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        if (Array.isArray(posts) && posts.length > 0) {
            posts.forEach(post => {
                const user = users.find(user => user.id === post.userId) || { username: 'Desconhecido', nome: 'Desconhecido' };

                const postElement = document.createElement('div');
                postElement.classList.add('post', 'mb-4', 'border', 'rounded', 'shadow-sm', 'p-3', 'bg-light');
                postElement.innerHTML = `
                    <div class="post-header d-flex justify-content-between align-items-center mb-2">
                        <h5 class="post-title">
                            <a href="/html/perfil.html?userId=${post.userId}" class="profile-link">${user.nome}</a>
                        </h5>
                        <span class="text-muted">
                            <a href="/html/perfil.html?userId=${post.userId}" class="profile-link">@${user.username}</a>
                        </span>
                    </div>
                    <img src="${post.image || 'https://via.placeholder.com/400'}" class="img-fluid rounded" alt="Postagem de ${post.id}">
                    <div class="post-body mt-2">
                        <p class="card-text">${post.content}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <p><strong>Curtidas:</strong> <span class="like-count">${post.likes}</span></p>
                            <button class="btn btn-primary like-button" data-post-id="${post.id}">Curtir</button>
                        </div>
                        <p><strong>Comentários:</strong> <span class="comment-count">${post.quantComent || 0}</span></p>
                        <button class="btn btn-secondary comment-button" data-post-id="${post.id}">Ver Comentários</button>
                        <div class="comments-section mt-2">
                            <div class="comments-list" style="display: none; margin-top: 10px;"></div>
                            <input type="text" class="comment-input form-control mt-2" placeholder="Adicionar um comentário...">
                            <button class="btn btn-success add-comment-button mt-1" data-post-id="${post.id}">Comentar</button>
                        </div>
                    </div>
                `;
                
                postsContainer.appendChild(postElement);
                
                const commentsList = postElement.querySelector('.comments-list');
                const comments = Array.isArray(post.comments) ? post.comments : [];
                comments.forEach(comment => {
                    const commentElement = document.createElement('p');
                    commentElement.textContent = comment;
                    commentsList.appendChild(commentElement);
                });
                
                const commentCountElement = postElement.querySelector('.comment-count');
                commentCountElement.textContent = comments.length;
                
                postElement.querySelector('.add-comment-button').addEventListener('click', async (event) => {
                    const postId = event.target.getAttribute('data-post-id');
                    const commentInput = postElement.querySelector('.comment-input');
                    const commentText = commentInput.value;
                    
                    if (commentText) {
                        const newComment = document.createElement('p');
                        newComment.textContent = commentText;
                        commentsList.appendChild(newComment);
                        commentsList.style.display = 'block';
                        
                        const postResponse = await fetch(`http://localhost:3000/posts/${postId}`);
                        const postData = await postResponse.json();
                        
                        const updatedComments = Array.isArray(postData.comments) ? postData.comments : [];
                        updatedComments.push(commentText);
                        postData.quantComent = updatedComments.length;
                        
                        await fetch(`http://localhost:3000/posts/${postId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...postData,
                                comments: updatedComments
                            })
                        });
                        
                        commentInput.value = ''; 
                        commentCountElement.textContent = postData.quantComent; 
                    }
                });
                
                postElement.querySelector('.like-button').addEventListener('click', async (event) => {
                    const postId = event.target.getAttribute('data-post-id');
                    const likeCountElement = postElement.querySelector('.like-count');
                    
                    let likes = parseInt(likeCountElement.textContent) || 0;
                    likes += 1;
                    likeCountElement.textContent = likes;
                    
                    await fetch(`http://localhost:3000/posts/${postId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...post,
                            likes: likes,
                            quantComent: comments.length
                        })
                    });
                });
                
                postElement.querySelector('.comment-button').addEventListener('click', () => {
                    const commentsList = postElement.querySelector('.comments-list');
                    commentsList.style.display = commentsList.style.display === 'none' ? 'block' : 'none';
                });
            });
        } else {
            postsContainer.innerHTML = '<p>Nenhuma publicação encontrada.</p>';
        }
        
        document.getElementById('logout-link').addEventListener('click', () => {
            localStorage.removeItem('userId');
            window.location.href = '/html/login.html';
        });
    } catch (error) {
        console.error('Erro ao carregar as publicações:', error);
        alert('Ocorreu um erro ao carregar as publicações. Tente novamente mais tarde.');
    }
});
