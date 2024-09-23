document.addEventListener('DOMContentLoaded', async () => {
    // Obtendo o userId da URL ou do localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('userId');

    if (!userId) {
        userId = localStorage.getItem('userId');
    }

    if (!userId) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/html/login.html';
        return;
    }

    try {
        const userResponse = await fetch(`http://localhost:3000/users/${userId}`);
        if (!userResponse.ok) throw new Error('Erro ao carregar o perfil');

        const userProfile = await userResponse.json();
        console.log(userProfile);

        const usernameElement = document.getElementById('username');
        const descricaoElement = document.getElementById('descricao');
        const profilePicElement = document.getElementById('profile-pic');

        console.log(usernameElement, descricaoElement, profilePicElement);

        usernameElement.textContent = userProfile.username;
        descricaoElement.textContent = userProfile.descricao;
        profilePicElement.src = userProfile.image || 'https://via.placeholder.com/150';

        const postsResponse = await fetch(`http://localhost:3000/posts?userId=${userId}`);
        const posts = await postsResponse.json();

        document.getElementById('post-count').textContent = posts.length;

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('col-4', 'post');
            postElement.innerHTML = `
                <a href="post.html?postId=${post.id}">
                    <img src="${post.image || 'https://via.placeholder.com/400'}" alt="Postagem" class="img-fluid">
                </a>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao carregar o perfil:', error);
        alert('Ocorreu um erro ao carregar o perfil. Tente novamente mais tarde.');
    }
});
