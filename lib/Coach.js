module.exports = class Coach {
  constructor(dependencies) {
      this.match = dependencies.match
      this.robotsProperties = this.match.robotsProperties

      this.currentOrder = {}

      this.init()
  }

  async init() {
    /*
    Inicializa algoritmos e estruturas auxiliares para tomar decisões
    */

  }

  decide(data, robots) {
    /*
    Metodo principal de decisão do coach para os robos, atribui aos objetos de
    robots:
      - running_play: a Play vigente que sera executada pelo robot naquela iteração
      - robots: um dicionario contento 3 elementos relativos aos dados dos robos:
        * self: dados referentes ao proprio robo
        * teammate: lista de elementos referentes aos dados dos robos de mesmo time
        * foes: lista de elementos robos referentes aos dados dos robos adversarios

    @param data     Dados tratados pelo dataManager
    @param robots   ultima iteração de robots.
    */


  }
}
