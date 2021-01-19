# Agenda Web

Aplicação Web simples, de uma agenda de contatos telefônicos, que permite a criação de contatos e associar telefones aos mesmos.

## Recursos utilizados

- Visual Studio 2019 Community

- AspNet Core MVC

- AspNet WebAPI

- DotNet Core 3.1

- LibMan

  - Bootstrap 4

  - Jquery

- Entity Framework

- Sql Server LocalDB

## Como executar

1. Clone o projeto

2. Abra a solução no **Visual Studio 2019** ou superior.

3. Abra o **Console do Gerenciador de Pacotes**. (Ferramentas > Gerenciador de Pacotes NuGet > Console do Gerenciador de Pacotes)

4. Digite `Update-Database` para criar o banco de dados local.

5. Aguarde o processo concluir e rode direto da IDE em Debug ou Release.

## Troubleshoot

Caso ocorra o erro "**Erro ao ler API**", verifique se a porta da url da api localizada na variável `apiUrl` no arquivo `agenda.js` (WebAgenda.Core\\wwwroot\\js\\agenda.js) é a mesma que está em execução no momento.

## Trabalhos Futuros

- Utilizar ou implementar um sistema de usuário para proteger e permitir 1 agenda por usuário.

- Proteção da API com este sistema de usuário.
