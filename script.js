document.addEventListener('DOMContentLoaded', () => {
  const nomeInput = document.querySelector('#nomeInput');
  const cadastroForm = document.querySelector('#cadastroForm');

  function getPersistedCharacters() {
      const personagensJSON = localStorage.getItem('personagens');
      return personagensJSON ? JSON.parse(personagensJSON) : [];
  }

  function setPersistedCharacters(personagens) {
      localStorage.setItem('personagens', JSON.stringify(personagens));
  }

  function buscarLocalmente(nome) {
      const personagens = getPersistedCharacters();
      return personagens.filter(personagem => personagem.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  function exibirPersonagem(personagem) {
      document.querySelector('#nomeDisplay').innerText = `Nome: ${personagem.nome}`;
      document.querySelector('#generoDisplay').innerText = `Gênero: ${personagem.genero}`;
      document.querySelector('#alturaDisplay').innerText = `Altura: ${personagem.altura} cm`;
      document.querySelector('#planetaDisplay').innerText = `Planeta: ${personagem.planeta}`;
  }

  function buscarNaAPI(nome) {
      return fetch(`https://swapi.dev/api/people/?search=${nome}`)
          .then(response => response.json())
          .then(dados => {
              const pessoa = dados.results[0];
              if (pessoa) {
                  return fetch(pessoa.homeworld)
                      .then(response => response.json())
                      .then(planetaDados => ({
                          nome: pessoa.name,
                          genero: pessoa.gender,
                          altura: pessoa.height,
                          planeta: planetaDados.name
                      }))
                      .catch(error => {
                          console.error('Erro ao buscar planeta:', error);
                          return null;
                      });
              } else {
                  return null;
              }
          })
          .catch(error => {
              console.error('Erro ao buscar dados:', error);
              return null;
          });
  }

  function procurar() {
      const nome = nomeInput.value.trim();

      if (!nome) {
          alert('Por favor, digite um nome para buscar.');
          return;
      }

      const personagensLocais = buscarLocalmente(nome);
      if (personagensLocais.length > 0) {
          // Exibe o primeiro personagem encontrado localmente
          exibirPersonagem(personagensLocais[0]);
      } else {
          buscarNaAPI(nome).then(personagemAPI => {
              if (personagemAPI) {
                  exibirPersonagem(personagemAPI);
              } else {
                  document.querySelector('#nomeDisplay').innerText = 'Personagem não encontrado.';
                  document.querySelector('#generoDisplay').innerText = '';
                  document.querySelector('#alturaDisplay').innerText = '';
                  document.querySelector('#planetaDisplay').innerText = '';
              }
          });
      }
  }

  function cadastrar() {
      const nome = document.querySelector('#nome').value.trim();
      const genero = document.querySelector('#genero').value.trim();
      const altura = document.querySelector('#altura').value.trim();
      const planeta = document.querySelector('#planeta').value.trim();

      if (nome && genero && altura && planeta) {
          const personagem = {
              nome: nome,
              genero: genero,
              altura: altura,
              planeta: planeta,
          };

          const personagens = getPersistedCharacters();
          personagens.push(personagem);
          setPersistedCharacters(personagens);

          alert('Personagem cadastrado com sucesso!');
          cadastroForm.reset();
      } else {
          alert('Por favor, preencha todos os campos.');
      }
  }

  if (nomeInput) {
      nomeInput.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
              procurar();
          }
      });
  }

  if (cadastroForm) {
      cadastroForm.addEventListener('submit', (event) => {
          event.preventDefault();
          cadastrar();
      });
  }

  const personagens = getPersistedCharacters();
  if (personagens.length) {
      console.log("Personagens salvos:", personagens);
  }
});
