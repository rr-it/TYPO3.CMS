<?php

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

namespace TYPO3\CMS\Backend\Form\FormDataGroup;

use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use TYPO3\CMS\Backend\Form\FormDataGroupInterface;

/**
 * A data provider group dedicated for the type='select', renderType='selectTree'
 * calculate tree items FormSelectTreeAjaxController.
 */
#[Autoconfigure(public: true, shared: false)]
readonly class TcaSelectTreeAjaxFieldData implements FormDataGroupInterface
{
    public function __construct(
        private OrderedProviderList $orderedProviderList,
    ) {}

    public function compile(array $result): array
    {
        $this->orderedProviderList->setProviderList(
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['formDataGroup']['tcaSelectTreeAjaxFieldData']
        );
        return $this->orderedProviderList->compile($result);
    }
}
