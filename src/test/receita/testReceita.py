import unittest
from srv.domain.entity.receita.receita import Receita

class TestClass(unittest.TestCase):

    def testaPreco(self):
        receitaNova=Receita()
        self.assertRaises(TypeError,receitaNova.preco,0)
    
    def testaReceita(self):
        receita=Receita()
        receita.rendimento=30
        self.assertEqual(receita.rendimento,30)
        self.assertEqual(receita.rendimento,29)

if __name__ == "__main__":
        unittest.main()