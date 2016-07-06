'use strict'

const collections = require('./collections')

const classificationKeyFor = classification => (
  classification.base_type.value + '/' + classification.sub_type.value + (classification.style ? '#' + classification.style.value : '')
)

module.exports.extractClassificationsFrom = conversations => {
  let classifications = []

  conversations.forEach(conversation => {
    conversation.messages.forEach(message => {
      message.parts.forEach(part => {
        if (part.classifications) {
          classifications = classifications.concat(part.classifications)
        }
      })
    })
  })

  return collections.deduplicate(classifications, classificationKeyFor)
}

const slotKeyFor = slot => slot.base_type + '/' + slot.entity + '#' + slot.role

module.exports.extractSlotsFrom = conversations => {
  const slots = []

  conversations.forEach(conversation => {
    conversation.messages.forEach(message => {
      message.parts.forEach(part => {
        Object.keys(part.slots).forEach(key => {
          const slot = part.slots[key]
          slot.roles.forEach(role => {
            slots.push({
              base_type: slot.base_type,
              entity: slot.entity,
              role: role,
            })
          })
        })
      })
    })
  })

  return collections.deduplicate(slots, slotKeyFor)
}
