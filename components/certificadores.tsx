import Link from "next/link"
import Image from "next/image"

export function Certificadores() {
  return (
    <section id="certificadores">
      <div className="flex flex-col w-full justify-center items-center my-16">
        <h3 className="text-3xl sm:text-4xl mb-8 max-w-2xl mx-auto text-pretty font-bold text-black">Certificado Por</h3>
        <div className="flex flex-row gap-10 md:gap-3 justify-between w-2/3 md:1/2">
          <Link href="https://supergana.com.ve/" aria-label="go home" className="block">
              <Image
                src="/super_gana.png"
                width={120}
                height={120}
                className="object-cover"
                alt="Super Gana"
              />
            </Link>
          <Link href="https://tripletachira.com/" aria-label="go home" className="block">
              <Image
                src="/tachira.png"
                width={120}
                height={120}
                className="object-cover"
                alt="Tachira su loteria"
              />
            </Link>
          <Link href="https://pagina.conalot.gob.ve/" aria-label="go home" className="block">
              <Image
                src="/conalot.png"
                width={120}
                height={120}
                className="object-cover"
                alt="Conalot"
              />
            </Link>
        </div>
      </div>
    </section>
  )
}
