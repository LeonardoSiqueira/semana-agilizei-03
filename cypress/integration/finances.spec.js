/// <reference types= "cypress" />

import { format, prepareLocalStorage } from '../support/utils';

// cy.viewport
// arquivos de config
// configs por linha de comando

context("Dev Finances Agilizei", () => {
  //hooks
  //trechis que executam antes e depois do teste
  //before -> antes de todos os testes
  //beforeEach -> antes de cada teste
  //after -> deposi de todos os testes
  //afterEach -> depois de cada teste

  beforeEach(() => {
    cy.visit("https://devfinance-agilizei.netlify.app", {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }
    });
  });

  it("Cadastrar Entradas", () => {
    //   - entender o fluxo manualmente
    //   - mapear os elementos que vamos interagir
    //   - descrever as interações com cypress
    //   - adicionar as asserções que a gente precisa

    cy.get("#transaction .button").click(); // id + classe
    cy.get("#description").type("Mercado"); // id
    cy.get("[name=amount]").type(365); // atributos
    cy.get("[type=date]").type("2021-07-29"); // atributos
    cy.get("button").contains("Salvar").click(); // tipo e valor
    cy.get("#data-table tbody tr").should("have.length", 3);
  });

  it("Cadastrar Saídas", () => {
    cy.get("#transaction .button").click(); // id + classe
    cy.get("#description").type("Mercado"); // id
    cy.get("[name=amount]").type(-173); // atributos
    cy.get("[type=date]").type("2021-07-30"); // atributos
    cy.get("button").contains("Salvar").click(); // tipo e valor
    cy.get("#data-table tbody tr").should("have.length", 3);
  });

  it("Remover entradas e saídas", () => {
    const entrada = "Mercado";
    const saida = "Combustivel";

    cy.get("#transaction .button").click(); // id + classe
    cy.get("#description").type("entrada"); // id
    cy.get("[name=amount]").type(365); // atributos
    cy.get("[type=date]").type("2021-07-29"); // atributos
    cy.get("button").contains("Salvar").click(); // tipo e valor

    cy.get("#transaction .button").click(); // id + classe
    cy.get("#description").type("saida"); // id
    cy.get("[name=amount]").type(-173); // atributos
    cy.get("[type=date]").type("2021-07-29"); // atributos
    cy.get("button").contains("Salvar").click(); // tipo e valor

    cy.get("td.description")
      .contains("entrada")
      .parent()
      .find("img[onclick*=remove]")
      .click();

    cy.get("td.description")
      .contains("saida")
      .siblings()
      .children("img[onclick*=remove]")
      .click();
  });
  it("Validar saldo com diversas transações", () => {
    //  capturar as linhas com as transações
    // formatar esses valores das linhas

    //somar os valores de entradas e saidas

    //  capturar o texto do total
    //  comparar o somatorio de entradas e despesas com o total

    let incomes = 0;
    let expenses = 0;

    cy.get("#data-table tbody tr").each(($el, index, $list) => {
      cy.get($el)
        .find("td.income, td.expense")
        .invoke("text")
        .then((text) => {
          if (text.includes("-")) {
            expenses = expenses + format(text);
          } else {
            incomes = incomes + format(text);
          }
        });
    });

    cy.get("#totalDisplay")
      .invoke("text")
      .then((text) => {
        let formattedTotalDisplay = format(text);
        let expectedTotal = incomes + expenses;

        expect(formattedTotalDisplay).to.eq(expectedTotal);
      });
  });
});
// npx cypress open --config viewportWidth=411,viewportHeight=823
