// início do código :)

// definição da altura e largura do jogo como constantes, permitindo
// que elas sejam invariáveis ao decorrer do código
const larguraJogo = 700;
const alturaJogo = 850;

// definições das, dentro de uma constante, propriedades de configuração do jogo como tipo
// de API (automática), largura e altura da tela (dimensões pré-determinadas nas consts acima).
const config = {
  type: Phaser.AUTO,
  width: larguraJogo,
  height: alturaJogo,

  // fundamentando a física dentro do jogo
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },

  // neste trecho, defini-se funcionamento da cena do jogo, neste caso, única cena
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// cria um novo jogo que segue as propriedades determinadas na constante
// config, novamente como constante para que seja invariável.
const game = new Phaser.Game(config);

// variáveis usadas ao longo jogo, para diversos objetos.
let alien;
let teclado;
let turbo;
let plataforma;
let plataforma1;
let moeda;
let placar;
let pontuacao = 0;
let parabens = 0;
const bonificacao = [2, 5, 30, 40, 50, 60, 70, 80, 90, 100];

function preload() {
  //carregando a imagem do cenário
  this.load.image("background", "assets/bg.png");

  //carregando a imagem do alien
  this.load.image("alien", "assets/alienigena.png");

  //carregando a imagem do fogo
  this.load.image("fogo", "assets/turbo.png");

  //carregando as platformas
  this.load.image("plataforma_tijolo", "assets/tijolos.png");
  this.load.image("plataforma_tijolo1", "assets/tijolos.png");

  //carregandondo moeda
  this.load.image("moeda", "assets/moeda.png");
}

function create() {
  //criando input das teclas de direcional
  teclado = this.input.keyboard.createCursorKeys();

  // renderiza a imagem na tela e atribui à ela as proporções desejadas,
  // anteriormente definidas por meio de constantes
  this.add.image(larguraJogo / 2, alturaJogo / 2, "background");

  //criando turbo e a função para deixá-lo visível e invisível
  fogo = this.add.sprite(0, 0, "fogo");

  //criando o alien, lhe atribui física e tamanho
  alien = this.physics.add.sprite(larguraJogo / 2, 0, "alien");
  alien.body.setSize(110, 90, true);
  alien.setCollideWorldBounds(true);

  //criando plataformas e física entre o player e as plataformas
  plataforma = this.physics.add.staticImage(
    larguraJogo / 1.25,
    alturaJogo / 2,
    "plataforma_tijolo"
  );
  this.physics.add.collider(alien, plataforma);

  plataforma1 = this.physics.add.staticImage(
    larguraJogo / 4.5,
    alturaJogo / 2,
    "plataforma_tijolo1"
  );
  this.physics.add.collider(alien, plataforma1);

  //criando moeda, fazendo ela quicar e criando colisão ela, os limites do bg e as plataformas
  moeda = this.physics.add.sprite(larguraJogo / 2, 0, "moeda");
  moeda.setCollideWorldBounds(true);
  moeda.setBounce(0.7);
  this.physics.add.collider(moeda, plataforma);
  this.physics.add.collider(moeda, plataforma1);

  // adicionando placar
  placar = this.add.text(50, 50, "Moedas:" + pontuacao, {
    fontSize: "45px",
    fill: "#495613",
  });

  // criando o meio de coleta e interação com as moedas, além de determinar geração aleatória de sua posição X
  this.physics.add.overlap(alien, moeda, function () {
    moeda.setVisible(false);
    let posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
    moeda.setPosition(posicaoMoeda_Y, 100);
    pontuacao += 1;
    placar.setText("Moedas:" + pontuacao);
    moeda.setVisible(true);

    if(bonificacao.includes(pontuacao)){
      console.log(pontuacao);
    }
  });
}

// função para visibilizar o turbo
function turboOn() {
  fogo.setVisible(true);
} // função para invisibilizar o turbo
function turboOff() {
  fogo.setVisible(false);
}

function update() {
  // movimentação geral do alien
  if (teclado.up.isDown) {
    //movimento para cima e torna o turbo visível
    alien.setVelocityY(-150);
    turboOn();
  } else if (teclado.right.isDown) {
    //movimento para direita
    alien.setVelocityX(150);
  } else if (teclado.left.isDown) {
    //movimento para esquerda
    alien.setVelocityX(-150);
  } else {
    // "movimento" parado
    alien.setVelocityX(0);
    turboOff();
  }

  // aplicando atualização da posição do turbo, em função movimento do alien
  fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

// fim do código :)
