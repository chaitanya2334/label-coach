from tests import base


def setUpModule():
    base.enabledPlugins.append('label_coach')
    base.usedDBs = {'girder': True}
    base.startServer()


def tearDownModule():
    base.stopServer()


class CatsCatTestCase(base.TestCase):

    def testCatsWork(self):
        setUpModule()
        tearDownModule()
        self.assertEqual(1, 1)
