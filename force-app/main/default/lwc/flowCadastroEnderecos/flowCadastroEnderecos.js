import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class FlowCadastroEnderecos extends LightningElement {

    @track showFlow    = false;
    @track isResetting = false;
    @track flowInputVariables = [];

    // Controle interno: evita re-render desnecessário quando o recordId não mudou
    _currentRecordId = undefined;
    _resetTimeout    = null;

    // ─────────────────────────────────────────────────────────────────────────
    // Wire: reage a TODA mudança de página no Lightning Experience.
    // Na Utility Bar o componente persiste; este wire é o único mecanismo
    // confiável para capturar a navegação do usuário entre registros.
    // ─────────────────────────────────────────────────────────────────────────
    @wire(CurrentPageReference)
    handlePageReference(pageRef) {
        const recordId = this._extractRecordId(pageRef);

        // Evita reinicialização quando o contexto não mudou (ex.: refresh do wire)
        if (recordId === this._currentRecordId) {
            // Na primeira execução _currentRecordId é `undefined`; null !== undefined,
            // portanto o flow sempre é inicializado na montagem do componente.
            return;
        }

        this._currentRecordId = recordId;
        this._initFlow(recordId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Extrai o recordId apenas de páginas de registro padrão.
    // Páginas sem contexto (Home, List Views, Dashboards) retornam null,
    // e o Flow é aberto sem pré-preenchimento.
    // ─────────────────────────────────────────────────────────────────────────
    _extractRecordId(pageRef) {
        if (!pageRef) return null;

        if (pageRef.type === 'standard__recordPage') {
            return pageRef.attributes?.recordId ?? null;
        }

        // Outros tipos de página (standard__home, standard__objectPage, etc.)
        // não possuem recordId relevante para o Flow de endereços.
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Reinicializa o Flow desmontando e remontando o componente.
    // Necessário porque o lightning-flow não reprocessa variáveis de entrada
    // após a renderização inicial; a única forma segura é destruir e recriar.
    // ─────────────────────────────────────────────────────────────────────────
    _initFlow(recordId) {
        // Cancela reinicialização em andamento para evitar condições de corrida
        // quando o usuário navega rapidamente entre registros.
        if (this._resetTimeout) {
            clearTimeout(this._resetTimeout);
            this._resetTimeout = null;
        }

        // 1. Desmonta o flow atual
        this.showFlow    = false;
        this.isResetting = true;

        // 2. Prepara as variáveis de entrada
        if (recordId) {
            // O próprio Flow decide (via Decision interno) se é Conta ou Opportunity
            this.flowInputVariables = [
                { name: 'recordId', type: 'String', value: recordId }
            ];
        } else {
            // Sem contexto: Flow abre sem pré-preenchimento, sem erro
            this.flowInputVariables = [];
        }

        // 3. Remonta após um tick para garantir que o DOM foi completamente limpo
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._resetTimeout = setTimeout(() => {
            this.isResetting = false;
            this.showFlow    = true;
            this._resetTimeout = null;
        }, 100);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Trata eventos do ciclo de vida do Flow
    // ─────────────────────────────────────────────────────────────────────────
    handleFlowStatusChange(event) {
        const { status } = event.detail;

        if (status === 'FINISHED' || status === 'FINISHED_SCREEN') {
            // Reinicia o Flow para permitir novo cadastro sem fechar o painel
            this._initFlow(this._currentRecordId);
        }

        if (status === 'ERROR') {
            console.error('[flowCadastroEnderecos] Erro no Flow:', event.detail);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Limpeza ao remover o componente (ex.: usuário fecha a Utility Bar)
    // ─────────────────────────────────────────────────────────────────────────
    disconnectedCallback() {
        if (this._resetTimeout) {
            clearTimeout(this._resetTimeout);
            this._resetTimeout = null;
        }
    }
}
