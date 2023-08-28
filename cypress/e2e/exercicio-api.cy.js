/// <reference types="cypress" />
const { faker, ur } = require('@faker-js/faker');
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(Response =>{
               return contrato.validateAsync(Response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((Response) => {
               expect(Response.status).to.equal(200)
               expect(Response.body).to.have.property('usuarios')
               expect(Response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nomeFaker = faker.name.fullName()
          let emailFaker = faker.internet.email()
          cy.cadastrarUsuario(nomeFaker, emailFaker, "teste", "true")
          .then((Response) => {
               expect(Response.status).to.equal(201)
               expect(Response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Fulano da Silva", "beltrano@qa.com.br", "teste", "true")
          .then((Response) => {
               expect(Response.status).to.equal(400)
               expect(Response.body.message).to.equal('Este email já está sendo usado')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.fullName()
          let emailFaker = faker.internet.email()
          cy.cadastrarUsuario(nomeFaker, emailFaker, "teste", "true")
          .then(Response => {
              let id = Response.body._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": nomeFaker,
                         "email": emailFaker,
                         "password": "#teste",
                         "administrador": "true"
                    }
               }).then(Response => {
                    expect(Response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.name.fullName()
          let emailFaker = faker.internet.email()
          cy.cadastrarUsuario(nomeFaker, emailFaker, "teste", "true")
          .then(Response => {
               let id = Response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     });
});
