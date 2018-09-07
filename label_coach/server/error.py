import cherrypy


def errorMessage(string):
    cherrypy.response.status = 500
    return {
        'error': string,
    }