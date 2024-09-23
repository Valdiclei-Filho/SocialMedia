document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/html/login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o perfil');
        }

        const userProfile = await response.json();
        document.getElementById('nome').value = userProfile.nome;
        document.getElementById('username').value = userProfile.username;
        document.getElementById('descricao').value = userProfile.descricao;

        const profilePicPreview = document.querySelector('.profile-pic-preview');
        if (userProfile.image) {
            profilePicPreview.src = userProfile.image;
        }
    } catch (error) {
        console.error('Erro ao carregar o perfil:', error);
        alert('Ocorreu um erro ao carregar o perfil. Tente novamente mais tarde.');
    }

    document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const username = document.getElementById('username').value;
        const descricao = document.getElementById('descricao').value;

        const profilePicInput = document.getElementById('profile-pic');
        let image = null;

        if (profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const reader = new FileReader();

            reader.onloadend = async () => {
                image = reader.result;

                await updateProfile(userId, nome, username, descricao, image);
            };

            reader.readAsDataURL(file);
        } else {
            await updateProfile(userId, nome, username, descricao, null);
        }
    });

    async function updateProfile(userId, nome, username, descricao, image) {
        try {
            await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    nome,
                    username,
                    descricao,
                    image,
                }),
            });

            alert('Perfil atualizado com sucesso!');
            window.location.href = '/html/perfil.html'; 
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            alert('Ocorreu um erro ao atualizar o perfil. Tente novamente mais tarde.');
        }
    }
});
