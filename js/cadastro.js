document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;
  
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        username: username,
        descricao: '',
        email: email,
        password: senha
      })
    });
  
    if (response.ok) {
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    } else {
      alert('Erro no cadastro.');
    }
  });
  