# Guia Prático: Criando o Dashboard Executivo no Looker Studio & GA4

Este guia passo a passo permite montar o painel visual no **Google Looker Studio** para apresentar à diretoria/empresa o crescimento orgânico, demográfico (idade, gênero, cidade) e conversões do WhatsApp da **ENTRATTA**.

---

## 🚀 Passo 1: Configuração Prévia no Google Analytics 4 (GA4)

Antes de abrir o Looker Studio, certifique-se de que os dados estão ativos no GA4:

### 1.1. Ativar Google Signals (Dados de Idade e Gênero)
1. Acesse o **Google Analytics** (analytics.google.com).
2. Vá em **Administrador** (engrenagem no canto inferior esquerdo).
3. Em **Coleta e modificação de dados** > clique em **Coleta de dados**.
4. Clique em **Começar** em *Ativar a coleta de dados do Google Signals*.
5. Ative a chave **Reconhecimento de dados demográficos e de interesses**.

### 1.2. Marcar Eventos Chave (Conversões)
1. No menu Administrador > **Exibições de dados** > **Eventos**.
2. Na lista de eventos, ative a chave **"Marcar como evento principal"** para:
   - `click_whatsapp`
   - `generate_lead`
   - `partner_interest`
   - `order_completed`

### 1.3. Registrar Dimensões Personalizadas
1. No menu Administrador > **Definições personalizadas** > **Criar dimensão personalizada**:
   - Dimensão: `target_city` | Escopo: `Evento` | Parâmetro: `target_city`
   - Dimensão: `target_segment` | Escopo: `Evento` | Parâmetro: `target_segment`
   - Dimensão: `device_type` | Escopo: `Evento` | Parâmetro: `device_type`
   - Dimensão: `source_placement` | Escopo: `Evento` | Parâmetro: `source`

---

## 📊 Passo 2: Criando o Dashboard no Google Looker Studio

1. Acesse **[lookerstudio.google.com](https://lookerstudio.google.com)** e clique em **Relatório em Branco**.
2. Em **Adicionar dados ao relatório**, selecione o conector **Google Analytics**.
3. Selecione a conta e a propriedade **ENTRATTA (GA4)** e clique em **Adicionar**.

---

## 🎨 Passo 3: Montando os Cards e Gráficos do Painel

### Card 1: Scorecards Principais (KPIs do Mês vs Mês Anterior)
- **Scorecard A**: Total de Usuários Ativos (`Active Users`) com comparação para o período anterior.
- **Scorecard B**: Total de Cliques no WhatsApp (`Event count` com filtro `Event name = click_whatsapp`).
- **Scorecard C**: Taxa de Conversão de Leads (`Lead Conversion Rate`).

### Gráfico 2: Crescimento por Cidade (Mapa de Calor & Tabela)
- **Tipo**: Tabela com Barras de Calor.
- **Dimensão**: `Cidade` (`City`) ou `target_city`.
- **Métricas**: `Active Users`, `Event count (click_whatsapp)`.
- **Destaque**: Exibe o crescimento no eixo GO (Itumbiara, Goiânia, Rio Verde, Caldas Novas) e MG (Uberlândia, Uberaba, Araguari, BH).

### Gráfico 3: Perfil Demográfico (Idade e Gênero)
- **Gráfico de Barras Duplas / Colunas**:
  - **Dimensão**: `Idade do usuário` (`User age bracket`).
  - **Dimensão de Divisão**: `Gênero do usuário` (`User gender`).
  - **Métrica**: `Active Users` ou `Conversions`.
  - **Finalidade**: Mostra para a empresa a faixa etária predominante dos tomadores de decisão (B2B e residencial).

### Gráfico 4: Páginas com Maior Conversão de WhatsApp
- **Tipo**: Tabela.
- **Dimensão**: `Caminho da página` (`Page path`) e `target_segment`.
- **Métricas**: `Visualizações de página` (`Views`), `Cliques em WhatsApp` (`click_whatsapp`).
- **Finalidade**: Mostra quais landing pages locais e de segmentos estão gerando mais contatos.

### Gráfico 5: Desempenho Orgânico (Search Console Integrado)
- Clique em **Adicionar dados** > selecione **Search Console** > URL do site > **Pesquisa na Web**.
- **Tabela**: `Query` (Termo pesquisado) vs `Impressions`, `Clicks`, `Average Position`.
- **Exemplo de termos comprovando crescimento**:
  - `"capacho personalizado itumbiara"`
  - `"tapete personalizado uberlandia"`
  - `"capacho vinil clinica"`
  - `"fabricante de capacho goias"`

---

## 📈 Resumo da Rotina de Apresentação

- **Frequência sugerida**: Apresentação quinzenal ou mensal.
- **Compartilhamento**: Gere um link de visualização somente leitura no Looker Studio e compartilhe diretamente com os sócios/diretoria.
