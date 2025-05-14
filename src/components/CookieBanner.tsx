'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type Preferences = {
  necessary: boolean
  analytics: boolean
}

const defaultPrefs: Preferences = {
  necessary: true,
  analytics: false,
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    const saved = Cookies.get('cookie-preferences')
    if (!saved) {
      setOpen(true)
    } else {
      try {
        const parsed = JSON.parse(saved)
        setPrefs(parsed)
        setHasConsented(true)
      } catch {
        setOpen(true)
      }
    }
  }, [])

  const savePrefs = (prefsToSave: Preferences) => {
    Cookies.set('cookie-preferences', JSON.stringify(prefsToSave), { expires: 365 })
    setOpen(false)
    setHasConsented(true)
    window.location.reload()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Preferenze cookie</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Utilizziamo i cookie per migliorare la tua esperienza di navigazione. Puoi scegliere
              quali cookie accettare. Leggi la nostra{' '}
              <a href="https://www.iubenda.com/privacy-policy/40294398" className="underline">Privacy Policy</a>.
            </p>

            <div className="flex items-center justify-between pt-2">
              <Label>Cookie necessari</Label>
              <Switch checked disabled />
            </div>

            <div className="flex items-center justify-between">
              <Label>Cookie di analisi (Analytics & Speed Insights)</Label>
              <Switch
                checked={prefs.analytics}
                onCheckedChange={(v) => setPrefs({ ...prefs, analytics: v })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => savePrefs(prefs)}>Salva</Button>
            <Button onClick={() => savePrefs({ ...defaultPrefs, analytics: true })}>Accetta tutti</Button>
          </div>
        </DialogContent>
      </Dialog>

      {hasConsented && (
  <div className="fixed bottom-4 right-4 z-50">
    <button
      onClick={() => setOpen(true)}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow-md hover:bg-muted transition md:px-3 md:py-1 md:w-auto md:h-auto md:rounded-lg"
      title="Modifica preferenze cookie"
    >
      <span className="hidden md:inline text-sm">Modifica cookie</span>
      <span className="md:hidden text-lg" aria-hidden>⚙️</span>
    </button>
  </div>
)}

    </>
  )
}
