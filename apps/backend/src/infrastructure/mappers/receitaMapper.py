from src.domain.entity.receita.receita import Receita
from src.infrastructure.persistencia.receitaModel import ReceitaModel


class ReceitaMapper:

    @staticmethod
    def to_domain(model: ReceitaModel) -> Receita:
        """
        Converte um objeto do ORM (ReceitaModel) para a Entidade de Domínio (Receita).
        """
        receita = Receita()
        # Nota: a entidade de negócio não tem id publico ou mapeado na v1, mas o model tem.
        receita.nome = model.nome
        receita.preco_venda_sugerido = model.preco_venda_sugerido
        receita.descricao = model.descricao
        receita.rendimento = model.rendimento
        receita.idUsuario = model.usuario_id
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
            usuario_id=entity.idUsuario
        )
