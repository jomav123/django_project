from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


def welcome(request):
    templates = loader.get_template('first.html')
    return HttpResponse(templates.render() )



