# Projeto e Implementação de Sistemas Distribuídos

O projeto consiste em um site de e-commerce. Nesse site, o usuário, quando logado, pode adicionar itens ao carrinho. No carrinho, o usuário pode remover itens, editar quantidades, limpar ou efetuar a compra. Ao finalizar a compra, um e-mail com os detalhes do pedido é enviado ao usuário. As compras podem ser acompanhadas na aba de pedidos, onde o status é atualizado periodicamente por um módulo da aplicação.


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
      - Django + Celery + Redis
      - Tarefas assíncronas como envio de e-mails e alteração do status dos pedidos são executadas com Celery, tendo o Redis como broker
    - Geração de portfólios PDF
      - ReportLab + Celery + Redis
      -  A geração de arquivos PDF com os produtos do usuário é feita de forma assíncrona.
    - Front End
      - React
      - Responsável pela interface do usuário e comunicação com o back-end por meio de requisições REST.
    - Docker
      - Todos os serviços (frontend, backend, banco de dados, Redis e Celery) são executados em contêineres isolados, o que facilita a implantação e simula um ambiente distribuído.
### Grupo: Hudo Leonardo e Samuel Vidal
      
      
  
