from girder.models.model_base import AccessControlledModel


class CatModel(AccessControlledModel):
    def initialize(self):
        self.name = 'cat_model'
        self.ensureIndex('name')

    def validate(self, doc):
        return doc

    def feed(self, doc):
        query = {
            '_id': doc['_id']
        }

        updates = {
            '$set': {'fed': True}
        }

        print('A cat is being fed!')
        return self.update(query, updates, multi=False)
