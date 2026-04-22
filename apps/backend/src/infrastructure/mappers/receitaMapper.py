from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel


class ReceitaMapper:

    @staticmethod
    def to_domain(model: ReceitaModel) -> Receita:
        """
        Converte um objeto do ORM (ReceitaModel) para a Entidade de Domínio (Receita).
        Usa atributo privado diretamente para evitar re-validação de dados históricos do banco.
        """
        receita = Receita()
        receita.nome = model.nome
        receita.descricao = model.descricao
        receita.modo_preparo = model.modo_preparo
        receita.idUsuario = model.usuario_id

        # Campos numéricos: bypass do setter + conversão tolerante a falhas
        try:
            receita._Receita__preco_venda_sugerido = float(model.preco_venda_sugerido) if model.preco_venda_sugerido is not None else None
        except (ValueError, TypeError):
            receita._Receita__preco_venda_sugerido = None

        try:
            receita._Receita__rendimento = int(model.rendimento) if model.rendimento is not None else None
        except (ValueError, TypeError):
            receita._Receita__rendimento = None

        try:
            receita._Receita__tempo_preparo = int(model.tempo_preparo) if model.tempo_preparo is not None else None
        except (ValueError, TypeError):
            receita._Receita__tempo_preparo = None

        return receita

    @staticmethod
    def to_model(entity: Receita) -> ReceitaModel:
        """
        Converte uma Entidade de Domínio (Receita) para um objeto do ORM (ReceitaModel).
        """
        return ReceitaModel(
            nome=entity.nome,
            preco_venda_sugerido=entity.preco_venda_sugerido,
            descricao=entity.descricao,
            rendimento=entity.rendimento,
            tempo_preparo=entity.tempo_preparo,
            modo_preparo=entity.modo_preparo,
            usuario_id=entity.idUsuario
        )
