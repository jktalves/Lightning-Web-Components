# Lightning-Web-Components
Lightning Web Component para Utility Bar do Salesforce que detecta o recordId da página e integra com qualquer Flow que precise desse contexto. Ideal para cadastro de endereços ou outros dados sem sair da tela. Reativo, reutilizável e fácil de adaptar.

---

# flowCadastroEnderecos

Este projeto é um Lightning Web Component (LWC) desenvolvido para Salesforce, pensado para facilitar o cadastro de endereços diretamente pela Utility Bar do Lightning Experience.

## O que este componente faz?

O `flowCadastroEnderecos` integra um Flow do Salesforce à Utility Bar, permitindo que o usuário cadastre ou edite endereços relacionados ao registro que está visualizando (Conta, Oportunidade, etc.), sem precisar sair da tela atual.

### Principais funcionalidades

- Contexto automático: Detecta o `recordId` da página de registro aberta e passa essa informação para o Flow, garantindo que o cadastro seja sempre relacionado ao registro correto.
- Reatividade à navegação: Se o usuário navegar entre registros, o componente reinicializa o Flow automaticamente, sempre refletindo o novo contexto.
- Experiência fluida: Exibe um spinner enquanto o Flow é reinicializado, evitando erros e melhorando a experiência do usuário.
- Reutilização: Ao finalizar o Flow, ele é reiniciado automaticamente, permitindo múltiplos cadastros sem precisar fechar o painel.
- Robustez: Lida com páginas sem contexto de registro (Home, List View, Dashboard), abrindo o Flow sem variáveis de entrada e sem causar erros.

## Estrutura do projeto

```
force-app/
  main/
    default/
      lwc/
        flowCadastroEnderecos/
          flowCadastroEnderecos.js
          flowCadastroEnderecos.html
          flowCadastroEnderecos.js-meta.xml
        jsconfig.json
sfdx-project.json
```

## Arquitetura e funcionamento
- O componente usa o `@wire(CurrentPageReference)` para monitorar mudanças de página no Lightning Experience.
- Quando detecta um novo registro, reinicializa o Flow passando o `recordId` como variável de entrada.
- Se não houver contexto de registro, o Flow é aberto "em branco".
- O ciclo de vida do Flow é controlado para evitar problemas de re-renderização e garantir que o usuário sempre veja o formulário correto.

## Quando usar?
Ideal para cenários onde o usuário precisa cadastrar ou editar endereços rapidamente, sem sair do registro atual, como em operações de atendimento, vendas ou suporte.

> Este LWC foi desenvolvido inicialmente para integrar com este fluxo específico, mas sua abordagem é genérica e pode ser reutilizada em qualquer Flow do Salesforce que precise receber o recordId da página atual.
