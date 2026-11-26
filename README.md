# 2026.3.2 - POS - Frondend mobile

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend mobile

[A descrição da atividade](atividade.md)

---
## Relato da atividade

**Aluno:** Pedro Davi de Lima Fernandes
- **GitHub:** [Pedro-Davi669](https://github.com/Pedro-Davi669)

### Aplicação mobile — Diatinf X (`my-app/`)

Versão mobile da rede social acadêmica **Diatinf X**, construída com **React Native + Expo + Expo Router** seguindo a identidade visual da DIATINF (`#0C3453`, `#CE701B`, `#F1881D`, `#FDC616`, `#F9EBC2`, `#A4BCCC`):

- **Feed Global (`Home`)**: cabeçalho com nome do usuário (`Pedro Davi de Lima Fernandes` / `@pedrodavi`), filtros por **Recentes** e **Avaliados**, criação rápida de publicações em texto, curtidas, avaliação de **1 a 3 estrelas** e comentário rápido nos cards.
- **Explorar (`Global Feed`)**: pesquisa de publicações por texto, usuário ou `#hashtags` em alta.
- **Meus Posts**: perfil do usuário autenticado, contadores de publicações/comentários e criação de novos posts (`/new-post`).
- **Social Stats**: ranking de interações (**Quem você mais comenta** e **Quem mais te comenta**).
- **Detalhes da Publicação e Comentários Encadeados**: visualização completa do post com árvore de comentários e respostas aninhadas.
- **Perfil Público e Autenticação**: troca rápida entre contas de demonstração, login e cadastro com persistência via `AsyncStorage`.

### Frontend mobile no navegador

![Aplicação React Native Diatinf X no navegador](prints/navegador.png)

### Frontend mobile no celular

> Pendente: abra o aplicativo no celular via Expo Go (`cd my-app && npx expo start --tunnel`), capture a tela, salve como `prints/celular.png` e substitua este aviso por `![Aplicação React Native no celular](prints/celular.png)`.

---
