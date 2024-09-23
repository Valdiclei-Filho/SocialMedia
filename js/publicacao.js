document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const imagemInput = document.getElementById('imagem');

    if (imagemInput.files.length > 0) {
        const file = imagemInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            const imagemDataUrl = reader.result;

            try {
                const response = await fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        title: titulo,
                        content: descricao,
                        likes: 0,
                        comments: [],
                        quantComent: 0,
                        image: imagemDataUrl
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao criar a publicação.');
                }

                alert('Publicação criada com sucesso!');
                window.location.href = '/html/homepage.html';
            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao criar a publicação. Tente novamente.');
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert('Por favor, selecione uma imagem.');
    }
});

// Adiciona a lógica de logout
document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    window.location.href = '/html/login.html'; // Redireciona para a página de login
});
