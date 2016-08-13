###
  Pokemon Go(c) MITM node proxy
  by Michael Strassburger <codepoet@cpan.org>

  This example just dumps all in-/outgoing messages and responses

  This example modified by Joshie for https, modified lines are marked
###

#Modified PokemonGoMITM = require './lib/pokemon-go-mitm'
PokemonGoMITM = require './lib/pokemon-go-mitm-with-https'

# Uncomment if you want to filter the regular messages
# ignore = ['GetHatchedEggs', 'DownloadSettings', 'GetInventory', 'CheckAwardedBadges', 'GetMapObjects']
ignore = []


#Modified server = new PokemonGoMITM port: 8081
server = new PokemonGoMITM proxyPort: 8081, httpsPort: 443
        .addRequestHandler "*", (data, action) ->
                console.log "[<-] Request for #{action} ", data, "\n" unless action in ignore
                false

        .addResponseHandler "*", (data, action) ->
                console.log "[->] Response for #{action} ", JSON.stringify(data, null, 4), "\n" unless action in ignore
                false
