#!/bin/bash

USERNAME='Bobster'
PASSWORD='bobo3bobo'

register () {

  curl -X POST https://localhost:5000/register -d "username=${USERNAME}, password=${PASSWORD}"
}


