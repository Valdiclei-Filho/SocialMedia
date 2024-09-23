document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const senha = document.getElementById('senha').value;

  const response = await fetch(`http://localhost:3000/users`);
  const users = await response.json();

  const userFound = users.find(user => user.password === senha);

  console.log(userFound)
  console.log(senha)

  if (userFound) {
    localStorage.setItem('userId', userFound.id);
    alert('Login realizado com sucesso!');
    window.location.href = '/html/homepage.html';
  } else {
    alert('Email ou senha inválidos.');
  }
});
