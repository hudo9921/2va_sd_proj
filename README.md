# ProjetoSD

O projeto consiste em um site de e-commerce.
Nesse site o usuário, quando logado, pode adicionar  itens ao seu carrinho, nele o usuário pode remover itens, editar quantidade de itens, limpar o carrinho ou efetuar uma compra. Quando uma compra é efetuada, o usuário recebe um email com os detalhes do seu pedido. Além disso, as suas compras são mostradas na aba de compras onde o usuário pode acompanhar o status de seu pedido, esse pedido é processado por um dos modulos da aplicação onde ele periodicamente altera os status das compras que não foram entregues.


## Arquitetura:
  * Banco de dados
    - Postgres
    - Por meio de uma api (fake store api) populamos ele com produtos
  * Back End
    - Autenticação
      - Django e Django rest framework
      - Token jwt simple
      - Por meio dela que controlamos que o usuário está logado e pode acessar diversos recursos do site
    - Lógica de negócio
      - Django rest framework
      - Aqui que fazemos CRUD das principais entidades do sistema, além de certas validações
    - Gerenciador de pedidos
      - Django
      - Comunicação assíncrona por meio do celery (envio de emails e alteração do status dos pedidos) utilizando o redis como worker
      
     
### Grupo: Hudo Leonardo e Samuel Vidal
      
      
  
