import { useState, useEffect } from 'react'

export function useProduct(id: string) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        if (res.ok) {
          setProduct(data.data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  return { product, loading, error }
}

export function useProductVariant(productId: string, colorName: string | null) {
  const [variant, setVariant] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productId || !colorName) return
    async function fetchVariant() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${productId}/variant?color=${encodeURIComponent(colorName!)}`)
        const data = await res.json()
        if (res.ok) {
          setVariant(data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchVariant()
  }, [productId, colorName])

  return { variant, loading }
}
